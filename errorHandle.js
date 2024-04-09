const headers = {
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Length, X-Reuested-With",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH, POST, GET, OPTIONS, DELETE",
  "Content-Type": "application/json",
};
const errorMsg = {
  "status": "false",
  "message": "欄位未填寫正確，或無此 todo id。"
}

export function errorHandle(res, method) {
  errorMsg.method = method;
  res.writeHead(400, headers);
  res.write(JSON.stringify(errorMsg));
  res.end();
};
