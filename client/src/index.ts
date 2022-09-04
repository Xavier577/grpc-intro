import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const packageDefinition = protoLoader.loadSync("../todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);

const todoPackage = grpcObject.todoPackage;

// @ts-ignore
const client = new todoPackage.Todo(
  "localhost:9000",
  grpc.credentials.createInsecure()
);

client.createTodo(
  {
    id: -1,
    text: "create graphql server",
  },
  (err: any, response: any) => {
    if (err != null) {
      console.error(err);
    }
    console.log("creating_todos", response);
  }
);

// this directly fetches the entire todos
client.readTodos({}, (err: any, response: any) => {
  console.log("getting_all_item");
  if (err != null) {
    console.error(err);
  }
  console.log("Recieved from server", response);
});

// read data through streams
function readTodosFromStream() {
  const todos: any[] = [];

  const call = client.readTodosStream();
  console.log(call.on);
  call.on("data", (item: any) => {
    console.log("reading_data_from_stream");
    console.log({ item });
    if (item) {
      todos.push(item);
    }
  });

  call.on("end", () => {
    console.log("server done!");
    console.log({ todos });
  });
}

readTodosFromStream();
