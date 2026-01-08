// import grpc from "@grpc/grpc-js";
// import protoLoader from "@grpc/proto-loader";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const packageDef = protoLoader.loadSync(
//   path.join(__dirname, "test.proto")
// );

// const proto = grpc.loadPackageDefinition(packageDef);

// let arr = [];

// function CreateCmdLineText(call, callback) {
//   console.log("Received from client:", call.request);

//   arr.push(call.request);

//   callback(null, {
//     cmdLineText: call.request.cmdLineText
//   });
// }

// function GetCmdTextAll(call, callback) {
//   callback(null, {
//     texts: arr
//   });
// }

// const server = new grpc.Server();

// server.addService(
//   proto.TextService.service,
//   {
//     CreateCmdLineText,
//     GetCmdTextAll
//   }
// );

// server.bindAsync(
//   "0.0.0.0:50051",
//   grpc.ServerCredentials.createInsecure(),
//   () => {
  
//     console.log("gRPC Server running on port 50051");
//   }
// );


import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageDef = protoLoader.loadSync(
  path.join(__dirname, "chat.proto")
);

const proto = grpc.loadPackageDefinition(packageDef);

// Bi-Directional Chat
function Chat(call) {
  console.log("Client connected");

  call.on("data", (msg) => {
    console.log(`${msg.sender}: ${msg.text}`);

    // Reply instantly
    call.write({
      sender: "Server",
      text: `Echo: ${msg.text}`
    });
  });

  call.on("end", () => {
    console.log("Client disconnected");
    call.end();
  });
}

const server = new grpc.Server();

// Use proto.chat.ChatService because of the package name
server.addService(proto.chat.ChatService.service, { Chat });

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => console.log("Live Chat Server running on 50051")
);
