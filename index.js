const { createServer } = require('http');
const { WebSocketServer } = require('ws');
require('dotenv').config();
const server = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Servidor WebSocket activo.\n');
});
const wss = new WebSocketServer({ server });
const PORT = process.env.PORT
const HOST = process.env.HOST
wss.on('connection', function connection(ws) {
  console.log("Nova connexió.");                                                                                                                                                        
  ws.send('something');
 
  ws.on('error', console.error);
 
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });
 0
  ws.on('close', function close() {
    console.log("Tancant connexió.")
  })
 
});
server.listen( PORT ,HOST, () => {
  console.log(`Servidor escoltant en ${HOST}:${PORT}`);
});