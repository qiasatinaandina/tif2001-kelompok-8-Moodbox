const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, (req, res) => res.json({ user: req.user })); // untuk uji middleware

module.exports = router;