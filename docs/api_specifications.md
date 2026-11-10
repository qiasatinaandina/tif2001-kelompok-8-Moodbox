# API Specification - Modul Autentikasi Moodbox

Base URL (lokal): `http://localhost:5000/api/v1`
Format data: JSON. Header untuk request body: `Content-Type: application/json`

---

## 1. POST /auth/register

Mendaftarkan akun baru dengan role default `user`.

**Aturan input**
- `name`: teks, 2 sampai 100 karakter (spasi di awal/akhir dipangkas).
- `email`: teks, format email valid, maksimal 150 karakter. Dipangkas dan diubah ke huruf kecil sebelum disimpan.
- `password`: teks, 8 sampai 72 karakter.
- Field tambahan (misalnya `confirmPassword`) diabaikan oleh backend.

**Request Body**
```json
{
  "name": "Budi Santoso",
  "email": "budi@contoh.com",
  "password": "rahasia123"
}
```

**Response 201 (sukses)**
```json
{
  "message": "Registrasi berhasil",
  "data": {
    "id": "0b1234ea-1ede-4095-9302-e96b0f29952f",
    "name": "Budi Santoso",
    "email": "budi@contoh.com",
    "role": "user",
    "created_at": "2026-10-13T22:47:37.343Z"
  }
}
```

**Response Galat**
| Status | Kondisi | Body |
|---|---|---|
| 400 | Field kosong | `{ "message": "Nama, email, dan kata sandi wajib diisi" }` |
| 400 | Field bukan teks | `{ "message": "Nama, email, dan kata sandi harus berupa teks" }` |
| 400 | Nama kurang dari 2 karakter | `{ "message": "Nama minimal 2 karakter" }` |
| 400 | Nama lebih dari 100 karakter | `{ "message": "Nama maksimal 100 karakter" }` |
| 400 | Email tidak valid | `{ "message": "Format email tidak valid" }` |
| 400 | Password kurang dari 8 karakter | `{ "message": "Kata sandi minimal 8 karakter" }` |
| 400 | Password lebih dari 72 karakter | `{ "message": "Kata sandi maksimal 72 karakter" }` |
| 409 | Email sudah terdaftar | `{ "message": "Email sudah terdaftar" }` |
| 500 | Kesalahan server | `{ "message": "Terjadi kesalahan pada server" }` |

---

## 2. POST /auth/login

Memverifikasi akun dan menerbitkan token JWT yang berlaku 24 jam. Login hanya memakai **email** (nomor WhatsApp belum didukung).

**Request Body**
```json
{
  "email": "budi@contoh.com",
  "password": "rahasia123"
}
```

**Response 200 (sukses)**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "user": {
    "id": "0b1234ea-1ede-4095-9302-e96b0f29952f",
    "name": "Budi Santoso",
    "email": "budi@contoh.com",
    "role": "user"
  }
}
```

**Response Galat**
| Status | Kondisi | Body |
|---|---|---|
| 400 | Field kosong | `{ "message": "Email dan kata sandi wajib diisi" }` |
| 400 | Field bukan teks | `{ "message": "Email dan kata sandi harus berupa teks" }` |
| 401 | Email atau password salah | `{ "message": "Email atau kata sandi salah" }` |
| 500 | Kesalahan server | `{ "message": "Terjadi kesalahan pada server" }` |

---

## 3. GET /auth/me (endpoint uji middleware)

Membutuhkan header `Authorization: Bearer <token>`.

**Response 200**
```json
{
  "user": {
    "id": "0b1234ea-1ede-4095-9302-e96b0f29952f",
    "email": "budi@contoh.com",
    "role": "user",
    "iat": 1760000000,
    "exp": 1760086400
  }
}
```

**Response Galat**
| Status | Kondisi | Body |
|---|---|---|
| 401 | Token tidak dikirim | `{ "message": "Token tidak ditemukan" }` |
| 401 | Token salah atau kedaluwarsa | `{ "message": "Token tidak valid atau kedaluwarsa" }` |

---

## 4. GET /health

Memastikan server berjalan.

**Response 200**
```json
{ "status": "ok" }
```

---

## Autentikasi
- Token JWT berlaku 24 jam, dikirim lewat header `Authorization: Bearer <token>`.
- Payload token: `id`, `email`, `role`, `iat`, `exp`.
- Password disimpan sebagai hash bcrypt (salt rounds 10) dan tidak pernah dikembalikan di response.
- Origin frontend yang diizinkan diatur lewat variabel `CORS_ORIGIN` di `.env`.

## Daftar Status Code
| Kode | Arti |
|---|---|
| 200 | Sukses |
| 201 | Data berhasil dibuat |
| 400 | Input tidak valid |
| 401 | Tidak terautentikasi / token salah |
| 409 | Email sudah terdaftar |
| 500 | Kesalahan server |

## Pengujian Otomatis
Endpoint dicakup unit test di `server/tests/` (`npm test`) dan dijalankan otomatis di GitHub Actions (check Test Backend).

## Catatan untuk Frontend
- Simpan `token` setelah login berhasil, lalu kirim di header `Authorization: Bearer <token>` pada request yang membutuhkan autentikasi.
- Token kedaluwarsa setelah 24 jam, pengguna harus login ulang.
- Login hanya menerima email; sesuaikan label dan validasi form login.

## Rencana Endpoint Sprint 2 (usulan)
| Method | URL | Keterangan |
|---|---|---|
| GET | /api/v1/packages | Daftar paket foto studio |
| POST | /api/v1/bookings | Pelanggan membuat booking |
| GET | /api/v1/bookings | Riwayat booking pengguna |
| PATCH | /api/v1/bookings/:id | Admin mengubah status booking |