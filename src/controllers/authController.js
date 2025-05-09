const { Player } = require('../mongo_schemas/player')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Crear un transportador SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'orirribas2000@gmail.com',
    pass: 'cuzcglkitjqkurdi'
  }
});

exports.register = async (req, res) => {
    const { nickname, email, phone, termsAccepted } = req.body; 

    try {
      // Verificar si el jugador ya existe
      if (!termsAccepted) {
        return res.status(400).json({ msg: 'Debes aceptar los términos de uso.' });
      }
      let player = await Player.findById(email);
      if (player) return res.status(400).json({ msg: 'El correo ya está registrado' });
      player = await Player.fil
      // Generar un código de verificación
      const verificationToken = Math.random().toString(36).substring(7);
  
      // Crear el jugador
      player = new Player({
        _id: email, 
        nickname: nickname,
        email: email,
        phone: phone,
        token: verificationToken,
        isVerified: false,
        verificationToken: verificationToken
      });
  
      await player.save();
  
      // Enviar el correo de verificación
      const mailOptions = {
        from: 'Guerra de estandartes <orirribas2000@gmail.com>',
        to: email,
        subject: 'Verifica tu cuenta',
        text: `Haz clic en el siguiente enlace para verificar tu cuenta: https://bandera2.ieti.site/api/auth/verify?token=${verificationToken}`
    };
  
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error('Error al enviar el correo:', error);
          return res.status(500).json({ msg: 'Error al enviar el correo de verificación' });
        }
  
        res.status(200).set('Content-Type', 'application/json').end(
            JSON.stringify({
              msg: 'Jugador registrado. Verifica tu correo electrónico.',
              token: verificationToken
            })
          );
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error en el servidor' });
    }
  };

exports.verify = async (req, res) => {
    const { token } = req.query; // Obtener el token de la query string

    try {
      // Buscar al jugador por el token de verificación
      const player = await Player.findOne({ verificationToken: token });
      if (!player) {
        return res.status(400).json({ msg: 'Token inválido o expirado' });
      }
  
      // Marcar al jugador como verificado
      player.isVerified = true;
      player.verificationToken = undefined; // Limpiar el token
      await player.save();
  
      // Redirigir al cliente a una página de confirmación
      res.redirect('https://bandera2.ieti.site/confirmation.html'); // Reemplaza con la URL de confirmación
    } catch (error) {
      console.error("Error al verificar el jugador:", error.message);
      res.status(500).json({ msg: 'Error en el servidor' });
    }
  };
