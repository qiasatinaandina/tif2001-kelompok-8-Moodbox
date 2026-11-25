const multer = require('multer');
const AppError = require('../utils/AppError');

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

const upload = multer({
  storage: multer.memoryStorage(), // tidak menulis ke disk (hosting ephemeral)
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) return cb(null, true);
    cb(new AppError(415, 'Tipe file ditolak. Hanya JPEG, PNG, atau WEBP.'));
  },
});

module.exports = { upload };
