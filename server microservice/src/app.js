import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageDef = protoLoader.loadSync(
  path.join(__dirname, "test.proto")
);

const proto = grpc.loadPackageDefinition(packageDef);

let arr = [];

function CreateCmdLineText(call, callback) {
  console.log("Received from client:", call.request);

  arr.push(call.request);

  callback(null, {
    cmdLineText: call.request.cmdLineText
  });
}

function GetCmdTextAll(call, callback) {
  callback(null, {
    texts: arr
  });
}

const server = new grpc.Server();

server.addService(
  proto.TextService.service,
  {
    CreateCmdLineText,
    GetCmdTextAll
  }
);

server.bindAsync(
  "0.0.0.0:4000",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("gRPC Server running on port 4000");
  }
);
