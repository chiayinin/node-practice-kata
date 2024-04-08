import { v4 as uuidv4 } from 'uuid';
import http from 'http';
import { errorHandle } from './errorHandle.js';

const headers = {
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Length, X-Reuested-With",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH, POST, GET, OPTIONS, DELETE",
  "Content-Type": "application/json",
}
let todos = [
  {
    title: "刷刷牙",
    id: uuidv4(),
  }
]
const successMsg = {
  "status": "success",
  "data": todos,
}

const requestListenner = (request, response) => {
  if(request.url === '/todos' && request.method === 'GET') {
    try {
      response.writeHead(200, headers);
      response.write(JSON.stringify(successMsg));
      response.end();
    } catch(error) {
      errorHandle(res);
    }
  }else{
    response.writeHead(404, headers);
    response.write("Not found.");
    response.end();
  }
};

const server = http.createServer(requestListenner);

server.listen(3005);
