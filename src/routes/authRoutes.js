const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registro
router.post('/register', authController.register);

// Verificación
router.post('/verify', authController.verify);



module.exports = router;