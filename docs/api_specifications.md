# API Specification - Modul Autentikasi Moodbox

Base URL (lokal): `http://localhost:5000/api/v1/auth`
Format data: JSON. Header untuk request body: `Content-Type: application/json`

---

## 1. POST /register

Mendaftarkan akun baru dengan role default `user`.

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
    "id": "(0b1234ea-1ede-4095-9302-e96b0f29952f)",
    "name": "Budi Santoso",
    "email": "budi@contoh.com",
    "role": "user",
    "created_at": "(2026-10-13T22:47:37.343Z)"
  }
}
```

**Response Galat**
| Status | Kondisi | Body |
|---|---|---|
| 400 | Field kosong | `{ "message": "Nama, email, dan kata sandi wajib diisi" }` |
| 400 | Email tidak valid | `{ "message": "Format email tidak valid" }` |
| 400 | Password kurang dari 8 karakter | `{ "message": "Kata sandi minimal 8 karakter" }` |
| 409 | Email sudah terdaftar | `{ "message": "Email sudah terdaftar" }` |
| 500 | Kesalahan server | `{ "message": "Terjadi kesalahan pada server" }` |

---

## 2. POST /login

Memverifikasi akun dan menerbitkan token JWT yang berlaku 24 jam.

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
    "id": "(0b1234ea-1ede-4095-9302-e96b0f29952f)",
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
| 401 | Email atau password salah | `{ "message": "Email atau kata sandi salah" }` |
| 500 | Kesalahan server | `{ "message": "Terjadi kesalahan pada server" }` |

---

## 3. GET /me (endpoint uji middleware)

Membutuhkan header `Authorization: Bearer <token>`.

**Response 200**
```json
{
  "user": {
    "id": "(0b1234ea-1ede-4095-9302-e96b0f29952f)",
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

## Catatan untuk Frontend
- Simpan `token` setelah login berhasil, lalu kirim di header `Authorization: Bearer <token>` pada request yang membutuhkan autentikasi.
- Token kedaluwarsa setelah 24 jam, pengguna harus login ulang.
- Password tidak pernah dikembalikan di response apa pun.