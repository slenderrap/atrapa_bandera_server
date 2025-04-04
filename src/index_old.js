const { createServer } = require('http');
const { WebSocketServer } = require('ws');
const  express  = require('express')
require('dotenv').config();
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT;
const HOST = process.env.HOST;

const app = express();
app.use(express.static('public'));
app.use(express.json());


// Inicialitzar servidor HTTP
const httpServer = app.listen(port, () => {
  console.log(`Servidor HTTP escoltant a: http://localhost:${port}`);
});








const apkUrl = 'https://bandera2.ieti.site/android-debug.apk';
const qrOutputPath = path.join(__dirname, 'public', 'qrcode.png');

// Servidor HTTP para servir la imagen y responder a otras peticiones
const server = createServer((req, res) => {
  if (req.url === '/qrcode.png') {
    const imgPath = path.join(__dirname, 'public', 'qrcode.png');
    fs.readFile(imgPath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('QR no encontrado');
      } else {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Servidor WebSocket activo.\n');
  }
});

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  console.log("Nova connexió.");
  ws.send(JSON.stringify({ type: "info", message: "something" }));

  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.on('close', function close() {
    console.log("Tancant connexió.");
  });
});

// Generar el QR al arrancar
QRCode.toFile(qrOutputPath, apkUrl, {
  color: {
    dark: '#000',
    light: '#FFF',
  },
}, function (err) {
  if (err) {
    console.error('❌ Error generando el QR:', err);
  } else {
    console.log('✅ QR generado en public/qrcode.png');
  }
});

// Iniciar servidor
server.listen(PORT, HOST, () => {
  console.log(`Servidor escoltant en http://${HOST}:${PORT}`);
});

// Gestionar el tancament del servidor
let shuttingDown = false;
['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach(signal => {
  process.once(signal, shutDown);
});
function shutDown() {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log('Rebuda senyal de tancament, aturant el servidor...');
  httpServer.close(() => {
    ws.end();
    gameLoop.stop();
    process.exit(0);
  });
}

