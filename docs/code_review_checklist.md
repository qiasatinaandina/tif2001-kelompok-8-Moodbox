# Checklist Peer Code Review - Moodbox

Reviewer membuka tab **Files changed** dan memeriksa poin berikut sebelum Approve atau Request changes.

## A. Keamanan (Wajib Lulus)
- [ ] Tidak ada password, token, JWT_SECRET, atau DATABASE_URL yang ditulis langsung di kode
- [ ] Tidak ada file `.env` di dalam PR (hanya `.env.example`)
- [ ] Password tidak pernah dikembalikan di response API
- [ ] Input pengguna divalidasi sebelum diproses

## B. Kualitas Kode
- [ ] Penamaan variabel, fungsi, dan file konsisten
- [ ] Tidak ada console.log debugging atau kode mati
- [ ] Tidak ada potensi infinite loop atau memory leak
- [ ] Error ditangani (try/catch, status HTTP tepat)

## C. Git & Proses
- [ ] Nama branch sesuai konvensi
- [ ] Commit atomik, format Conventional Commits
- [ ] Template PR terisi lengkap, termasuk Closes #nomor
- [ ] Evidence (screenshot/GIF/log) dilampirkan

## D. Khusus Backend
- [ ] Password di-hash dengan bcryptjs (salt rounds 10)
- [ ] JWT berlaku 24 jam dan memakai process.env.JWT_SECRET
- [ ] role tidak diambil dari request body
- [ ] Endpoint sesuai docs/api_specifications.md
- [ ] server/.env.example tersedia tanpa nilai asli

## E. Khusus Frontend
- [ ] Endpoint dan nama field sesuai kontrak API
- [ ] URL API tidak di-hardcode
- [ ] Validasi form sisi klien berjalan
- [ ] State error dan loading ditangani