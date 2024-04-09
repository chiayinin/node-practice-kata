import { v4 as uuidv4 } from 'uuid';
import http from 'http';
import { errorHandle } from './errorHandle.js';

const headers = {
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Length, X-Reuested-With",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH, POST, GET, OPTIONS, DELETE",
  "Content-Type": "application/json",
};
let todos = [];
const successMsg = {
  "status": "success",
  "data": todos,
};

const requestListenner = (request, response) => {
  let body = '';

  request.on('data', (chunk) => {
    body += chunk;
  });
  if(request.url === '/todos' && request.method === 'GET') {
    try {
      response.writeHead(200, headers);
      response.write(JSON.stringify(successMsg));
      response.end();
    } catch(error) {
      errorHandle(response, request.method);
    }
  }else if(request.url === '/todos' && request.method === 'POST') {
    request.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        const userTodo = {
          "title": title,
          "id": uuidv4()
        };

        todos.push(userTodo);
        response.writeHead(200, headers);
        response.write(JSON.stringify(successMsg));
        response.end();
      } catch {
        errorHandle(response, request.method)
      }
    });
  }else if(request.url.startsWith('/todos/') && request.method === 'PATCH') {
    request.on('end', () => {
      try{
        const todo = JSON.parse(body).title;
        const id = request.url.split('/').pop();
        const index = todos.findIndex(item => item.id == id);

        if(todo !== undefined && index !== -1) {
          todos[index].title = todo;
          response.writeHead(200, headers);
          response.write(JSON.stringify(successMsg));
          response.end();
        }else {
          errorHandle(response, request.method);
        }
      }catch{
        errorHandle(response, request.method);
      }
    })
  }else if(request.url === '/todos' && request.method === 'DELETE') {
    try{
      todos.length = 0;
      response.writeHead(200, headers);
      response.write(JSON.stringify(successMsg));
      response.end();
    }catch {
      errorHandle(response, request.method);
    }
  }else if(request.url.startsWith('/todos/') && request.method === 'DELETE') {
    try{
      const id = request.url.split('/').pop();
      const index = todos.findIndex(item => item.id == id);

      if(index !== -1) {
        todos.splice(index, 1);
        response.writeHead(200, headers);
        response.write(JSON.stringify(successMsg));
        response.end();
      }else {
        errorHandle(response, request.method);
      }
    }catch {
      errorHandle(response, request.method);
    }
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

server.listen(process.env.PORT || 3005);
