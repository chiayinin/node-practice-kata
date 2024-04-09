import { v4 as uuidv4 } from 'uuid';
import http from 'http';
import { errorHandle } from './errorHandle.js';

const headers = {
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Length, X-Reuested-With",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH, POST, GET, OPTIONS, DELETE",
  "Content-Type": "application/json",
};
let todos = [
  {
    title: "刷刷牙",
    id: uuidv4(),
  }
];
let body = '';
const successMsg = {
  "status": "success",
  "data": todos,
};

const requestListenner = (request, response) => {
  if(request.url === '/todos' && request.method === 'GET') {
    try {
      response.writeHead(200, headers);
      response.write(JSON.stringify(successMsg));
      response.end();
    } catch(error) {
      errorHandle(response);
    }
  }else if(request.url === '/todos' && request.method === 'POST') {
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        const userTodo = {
          "title": title,
          "id": uuidv4()
        };

        todos.push(userTodo);
        response.writeHead(200, headers);
        response.write(JSON.stringify({
          "status": "success",
          "data": todos
        }));
        response.end();
      } catch {
        errorHandle(response)
      }
    })
  }else if(request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();
  }else {
    response.writeHead(404, headers);
    response.write("Not found 404.");
    response.end();
  }
};

const server = http.createServer(requestListenner);

server.listen(3005);
