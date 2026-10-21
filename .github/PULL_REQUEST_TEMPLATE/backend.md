## Deskripsi
<!-- Endpoint/modul/skema apa yang dibuat dan cara kerjanya -->


## Pertemuan
- [ ] P6: Tabel users, register, login, verifyToken
- [ ] P7: ESLint/Prettier server, rapikan controller/routes
- [ ] P8: Unit test hashing, token, endpoint
- [ ] P9: Finalisasi & update kontrak API

## Tipe Perubahan
- [ ] feat
- [ ] fix
- [ ] refactor
- [ ] test
- [ ] docs
- [ ] chore

## Related Issue
Closes #

## Cek Backend
- [ ] Password di-hash bcryptjs (salt 10), tidak pernah dikembalikan di response
- [ ] JWT 24 jam, memakai `process.env.JWT_SECRET`
- [ ] `role` tidak diambil dari request body
- [ ] Status HTTP tepat (200/201/400/401/409)
- [ ] `docs/api_specifications.md` dan `docs/database_schema.sql` diperbarui (jika berlaku)
- [ ] `server/.env.example` diperbarui, tanpa nilai asli (jika berlaku)
- [ ] `npm run lint` dan `npm run format:check` lolos (jika berlaku)
- [ ] `npm test` lolos, tidak memakai database produksi (jika berlaku)

## Keamanan & Proses
- [ ] Tidak ada credential / `.env` / `node_modules` di commit
- [ ] Branch dari `main` terbaru, commit atomik

## Evidence
- Postman/Thunder Client (sukses): 
- Postman/Thunder Client (error): 
- Tabel `users` / hash password: 
- Lint/test hijau (jika berlaku): 

## Catatan untuk Reviewer
<!-- Perubahan kontrak API yang berdampak ke frontend -->