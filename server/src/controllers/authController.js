const pool = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/token');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan kata sandi wajib diisi' });
    }
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Nama, email, dan kata sandi harus berupa teks' });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) {
      return res.status(400).json({ message: 'Nama minimal 2 karakter' });
    }
    if (cleanName.length > 100) {
      return res.status(400).json({ message: 'Nama maksimal 100 karakter' });
    }
    if (cleanEmail.length > 150 || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'Format email tidak valid' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Kata sandi minimal 8 karakter' });
    }
    if (password.length > 72) {
      return res.status(400).json({ message: 'Kata sandi maksimal 72 karakter' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    const hashed = await hashPassword(password);
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role, created_at`,
      [cleanName, cleanEmail, hashed]
    );

    return res.status(201).json({
      message: 'Registrasi berhasil',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan kata sandi wajib diisi' });
    }
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Email dan kata sandi harus berupa teks' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [cleanEmail]);
    const user = result.rows[0];

    // Pesan sengaja sama agar tidak membocorkan apakah email terdaftar
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Email atau kata sandi salah' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login berhasil',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

exports.getMe = (req, res) => {
  return res.status(200).json({ user: req.user });
};
