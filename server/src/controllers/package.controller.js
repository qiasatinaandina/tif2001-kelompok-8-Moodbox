const pool = require("../config/db");
const AppError = require("../utils/AppError");
const { parsePagination, buildMeta } = require("../utils/pagination");
const { buildPackageFilter, validatePackageInput } = require("../utils/packageQuery");
const { uploadImage, removeImage } = require("../services/storage.service");

const BASE_SELECT = `
  SELECT p.*, c.name AS category_name
  FROM packages p
  LEFT JOIN categories c ON c.id = p.category_id`;

// GET /api/v1/packages?search=duo&category=2&page=1&limit=10
async function listPackages(req, res, next) {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { clause, params } = buildPackageFilter(req.query);

    const countSql = `SELECT COUNT(*)::int AS total FROM packages p ${clause}`;
    const { rows: countRows } = await pool.query(countSql, params);
    const totalRows = countRows[0].total;

    const dataSql = `${BASE_SELECT} ${clause}
      ORDER BY p.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    const { rows } = await pool.query(dataSql, [...params, limit, offset]);

    res.json({ success: true, data: rows, meta: buildMeta(totalRows, page, limit) });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/packages/:id
async function getPackage(req, res, next) {
  try {
    const { rows } = await pool.query(`${BASE_SELECT} WHERE p.id = $1`, [req.params.id]);
    if (!rows.length) throw new AppError(404, "Paket tidak ditemukan");
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/packages  (multipart/form-data, field file: image)
async function createPackage(req, res, next) {
  let uploaded = null;
  try {
    const { errors, values } = validatePackageInput(req.body);
    if (errors.length) throw new AppError(400, errors.join("; "));

    if (req.file) uploaded = await uploadImage(req.file);

    const { rows } = await pool.query(
      `INSERT INTO packages
         (category_id, name, description, price, duration_min, max_pax, image_url, image_path, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,COALESCE($9, TRUE))
       RETURNING *`,
      [
        values.category_id ?? null, values.name, values.description ?? null,
        values.price, values.duration_min, values.max_pax,
        uploaded ? uploaded.url : null, uploaded ? uploaded.path : null,
        values.is_active ?? null,
      ]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    if (uploaded) await removeImage(uploaded.path).catch(() => {}); // hapus file jika insert gagal
    next(err);
  }
}

// PUT /api/v1/packages/:id
async function updatePackage(req, res, next) {
  let uploaded = null;
  try {
    const { errors, values } = validatePackageInput(req.body, { partial: true });
    if (errors.length) throw new AppError(400, errors.join("; "));

    const { rows: oldRows } = await pool.query(
      "SELECT image_path FROM packages WHERE id = $1",
      [req.params.id]
    );
    if (!oldRows.length) throw new AppError(404, "Paket tidak ditemukan");

    if (req.file) uploaded = await uploadImage(req.file);

    const { rows } = await pool.query(
      `UPDATE packages SET
         category_id  = COALESCE($1, category_id),
         name         = COALESCE($2, name),
         description  = COALESCE($3, description),
         price        = COALESCE($4, price),
         duration_min = COALESCE($5, duration_min),
         max_pax      = COALESCE($6, max_pax),
         is_active    = COALESCE($7, is_active),
         image_url    = COALESCE($8, image_url),
         image_path   = COALESCE($9, image_path),
         updated_at   = now()
       WHERE id = $10
       RETURNING *`,
      [
        values.category_id ?? null, values.name ?? null, values.description ?? null,
        values.price ?? null, values.duration_min ?? null, values.max_pax ?? null,
        values.is_active ?? null,
        uploaded ? uploaded.url : null, uploaded ? uploaded.path : null,
        req.params.id,
      ]
    );

    if (uploaded) await removeImage(oldRows[0].image_path).catch(() => {}); // hapus gambar lama
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    if (uploaded) await removeImage(uploaded.path).catch(() => {});
    next(err);
  }
}

// DELETE /api/v1/packages/:id
async function deletePackage(req, res, next) {
  try {
    const { rows } = await pool.query(
      "DELETE FROM packages WHERE id = $1 RETURNING image_path",
      [req.params.id]
    );
    if (!rows.length) throw new AppError(404, "Paket tidak ditemukan");
    await removeImage(rows[0].image_path).catch(() => {});
    res.json({ success: true, message: "Paket berhasil dihapus" });
  } catch (err) {
    next(err);
  }
}

module.exports = { listPackages, getPackage, createPackage, updatePackage, deletePackage };