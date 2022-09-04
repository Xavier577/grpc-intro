import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const packageDefinition = protoLoader.loadSync("../todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);

const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bindAsync(
  "0.0.0.0:9000",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err != null) {
      console.error(err);
      throw err;
    }
    console.log(`running on port ${port}`);
    server.start();
  }
);

// @ts-ignore
server.addService(todoPackage.Todo.service, {
  createTodo,
  readTodos,
  readTodosStream,
});

// app

const todos: { id: number; text: any }[] = [];

function createTodo(call: any, callback: any) {
  console.log(call);
  const id = todos.length + 1;
  const text = call.request["text"];
  const todoItem = { id, text };
  todos.push(todoItem);

  callback(null, todoItem);
}

function readTodos(_call: any, callback: any) {
  callback(null, { items: todos });
}

function readTodosStream(call: any, _callback: any) {
  todos.forEach((t) => call.write(t));
  call.end();
}
