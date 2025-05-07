const jwt = require('jsonwebtoken');

// Middleware para validar el token JWT en WebSockets
function authenticateWebSocket(socket, next) {
  const token = socket.handshake.auth.token; // Token enviado por el cliente
  if (!token) {
    return next(new Error('Token no proporcionado'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Adjuntar información del usuario al socket
    next();
  } catch (error) {
    return next(new Error('Token inválido o expirado'));
  }
}

// Inicializar el servidor WebSocket con autenticación
ws.init(httpServer, port);
ws.ws.use(authenticateWebSocket); // Aplicar middleware de autenticación