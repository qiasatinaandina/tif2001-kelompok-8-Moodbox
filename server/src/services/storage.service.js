const { randomUUID } = require("node:crypto");
const { getSupabase, getBucket } = require("../config/supabase");
const AppError = require("../utils/AppError");

const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

async function uploadImage(file, folder = "packages") {
  // ekstensi diambil dari MIME yang sudah divalidasi, bukan dari nama file pengguna
  const filePath = `${folder}/${Date.now()}-${randomUUID()}.${EXT[file.mimetype]}`;
  const supabase = getSupabase();

  const { error } = await supabase.storage
    .from(getBucket())
    .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });
  if (error) throw new AppError(502, `Gagal upload ke cloud storage: ${error.message}`);

  const { data } = supabase.storage.from(getBucket()).getPublicUrl(filePath);
  return { url: data.publicUrl, path: filePath };
}

async function removeImage(filePath) {
  if (!filePath) return;
  await getSupabase().storage.from(getBucket()).remove([filePath]);
}

module.exports = { uploadImage, removeImage };