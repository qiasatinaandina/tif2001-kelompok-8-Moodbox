const multer = require("multer");

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || "Terjadi kesalahan server";

  if (err instanceof multer.MulterError) {
    status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    message = err.code === "LIMIT_FILE_SIZE" ? "Ukuran file melebihi batas 2 MB" : err.message;
  } else if (err.code === "23503") {
    status = 400;
    message = "category_id tidak ditemukan";
  } else if (err.code === "23505") {
    status = 409;
    message = "Data duplikat";
  }

  if (status >= 500) console.error(err);
  res.status(status).json({
    success: false,
    message: status >= 500 ? "Terjadi kesalahan server" : message,
  });
}

module.exports = { errorHandler };