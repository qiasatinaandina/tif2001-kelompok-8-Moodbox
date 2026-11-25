// Menyusun WHERE dinamis: search (ILIKE) + category (WHERE category_id = $n)
function buildPackageFilter(query) {
  const where = [];
  const params = [];

  const search = (query.search || '').trim();
  if (search) {
    params.push(`%${search}%`);
    where.push(`(p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
  }

  const category = parseInt(query.category, 10);
  if (Number.isInteger(category) && category > 0) {
    params.push(category);
    where.push(`p.category_id = $${params.length}`);
  }

  return { clause: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
}

function validatePackageInput(body, { partial = false } = {}) {
  const errors = [];
  const values = {};
  const has = (k) => body[k] !== undefined && body[k] !== '';

  if (has('name')) {
    values.name = String(body.name).trim();
    if (values.name.length < 3) errors.push('name minimal 3 karakter');
  } else if (!partial) errors.push('name wajib diisi');

  if (has('description')) values.description = String(body.description).trim();

  for (const [key, min] of [
    ['price', 0],
    ['duration_min', 1],
    ['max_pax', 1],
  ]) {
    if (has(key)) {
      const n = Number(body[key]);
      if (!Number.isInteger(n) || n < min) errors.push(`${key} harus bilangan bulat >= ${min}`);
      else values[key] = n;
    } else if (!partial) errors.push(`${key} wajib diisi`);
  }

  if (has('category_id')) {
    const n = Number(body.category_id);
    if (!Number.isInteger(n) || n < 1) errors.push('category_id tidak valid');
    else values.category_id = n;
  }

  if (has('is_active')) values.is_active = body.is_active === true || body.is_active === 'true';

  return { errors, values };
}

module.exports = { buildPackageFilter, validatePackageInput };
