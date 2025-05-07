const nodemailer = require('nodemailer');

// Crear un transportador SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail', // Servicio de correo
  auth: {
    user: 'orirribas2000@gmail.com', // Tu dirección de correo
    pass: 'cuzcglkitjqkurdi' // Usa una contraseña de aplicación si usas Gmail
  }
});

// Configurar el correo
const mailOptions = {
  from: 'Guerra de estandartes <orirribas2000@gmail.com>',
  to: 'oarribastaulats.cf@iesesteveterradas.cat',
  subject: 'Bienvenido a Guerra de Estandartes',
  text: 'Este es un correo de prueba enviado con Nodemailer.'
};

// Enviar el correo
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error al enviar el correo:', error);
  } else {
    console.log('Correo enviado:', info.response);
  }
});