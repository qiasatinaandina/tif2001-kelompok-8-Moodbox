# Dokumentasi UI Frontend Moodbox

## 1. Gambaran Umum

Frontend Moodbox menyediakan dua halaman autentikasi, yaitu Login dan Register. Kedua halaman dibuat menggunakan HTML, CSS, dan JavaScript.

Validasi input dilakukan pada sisi client menggunakan fungsi yang dipisahkan dalam file `validators.js`. Proses pengiriman form ditangani oleh `auth.js`.

Dokumentasi ini menjelaskan struktur antarmuka, aturan validasi, proses pengujian, dan cara menjalankan pemeriksaan kualitas kode frontend.

## 2. Halaman Login

Halaman Login menggunakan file `login.html` dengan judul "Masuk Akun | Moodbox Studio".

Elemen yang tersedia:

- Email atau nomor WhatsApp.
- Kata sandi akun.
- Tombol tampilkan atau sembunyikan kata sandi.
- Checkbox Ingat Saya.
- Tautan Lupa Kata Sandi.
- Tombol Masuk ke Akun Studio.
- Tautan menuju halaman Register.
- Area pesan kesalahan dan notifikasi.

Validasi Login:

1. Email atau nomor WhatsApp wajib diisi.
2. Email harus memiliki format yang valid atau nomor WhatsApp harus sesuai pola nomor HP Indonesia.
3. Kata sandi wajib diisi.

Jika input tidak valid, sistem menampilkan pesan kesalahan pada kolom terkait. Jika validasi berhasil, sistem menampilkan notifikasi bahwa validasi berhasil.

## 3. Halaman Register

Halaman Register menggunakan file `register.html` dengan judul "Daftar Member | Moodbox Studio".

Elemen yang tersedia:

- Nama lengkap.
- Alamat email.
- Kata sandi.
- Konfirmasi kata sandi.
- Tombol tampilkan atau sembunyikan kata sandi.
- Checkbox persetujuan syarat dan ketentuan.
- Tombol Buat Akun.
- Area pesan kesalahan dan notifikasi.

Validasi Register:

1. Nama lengkap wajib diisi dan minimal terdiri dari dua karakter.
2. Alamat email wajib diisi dan harus memiliki format yang valid.
3. Kata sandi wajib diisi dan minimal terdiri dari delapan karakter.
4. Konfirmasi kata sandi wajib diisi dan harus sama dengan kata sandi.
5. Pengguna wajib menyetujui syarat dan ketentuan.

Jika seluruh data memenuhi ketentuan, sistem menampilkan notifikasi bahwa data berhasil melewati validasi frontend.

## 4. Aturan Validasi

Fungsi validasi dipisahkan dalam file `validators.js` agar dapat digunakan kembali dan diuji secara terpisah.

| Fungsi                  | Ketentuan                                                         |
| ----------------------- | ----------------------------------------------------------------- |
| `isValidEmail()`        | Memeriksa format alamat email.                                    |
| `isValidEmailOrPhone()` | Memeriksa email atau nomor HP Indonesia.                          |
| `isValidName()`         | Nama minimal dua karakter setelah spasi awal dan akhir diabaikan. |
| `isValidPassword()`     | Kata sandi minimal delapan karakter.                              |
| `passwordsMatch()`      | Kata sandi dan konfirmasi harus sama.                             |
| `isTermsAccepted()`     | Persetujuan harus bernilai true.                                  |

Nomor HP dinormalisasi dengan menghapus spasi, tanda kurung, dan tanda hubung. Pola nomor yang diterima menggunakan awalan `+62`, `62`, atau `0`, diikuti angka `8` dan 7 sampai 12 digit berikutnya.

## 5. Alur Kerja Validasi

Proses validasi dijalankan melalui file `auth.js`.

Tahapan proses:

1. Browser menyelesaikan pemuatan dokumen melalui `DOMContentLoaded`.
2. JavaScript mengidentifikasi form Login dan Register.
3. Fungsi `setupLoginForm()` atau `setupRegisterForm()` dipanggil sesuai halaman.
4. Ketika form dikirim, JavaScript mencegah pengiriman form secara langsung.
5. Sistem memeriksa setiap input berdasarkan aturan validasi.
6. Jika terdapat kesalahan, sistem menampilkan pesan pada kolom terkait.
7. Jika seluruh input valid, sistem menampilkan notifikasi keberhasilan validasi.

## 6. Unit Testing

Pengujian unit menggunakan Jest dengan file pengujian `tests/validators.test.js`.

Pengujian mencakup enam fungsi validasi dengan total 13 test case.

| Fungsi                           | Jumlah Test Case |
| -------------------------------- | ---------------: |
| Validasi email                   |                3 |
| Validasi email atau nomor HP     |                1 |
| Validasi nama                    |                2 |
| Validasi kata sandi              |                3 |
| Konfirmasi kata sandi            |                2 |
| Persetujuan syarat dan ketentuan |                2 |
| **Total**                        |           **13** |

Pengujian mencakup kondisi input valid dan tidak valid untuk memastikan fungsi validasi bekerja sesuai ketentuan.

## 7. Perintah Pengujian dan Pemeriksaan Kode

Jalankan perintah berikut dari direktori `client`.

### Menjalankan unit testing

```bash
npm test
```

Untuk menjalankan Jest tanpa mode interaktif:

```bash
npm test -- --runInBand
```

### Menjalankan ESLint

```bash
npm run lint
```

### Memeriksa format kode dengan Prettier

```bash
npm run format:check
```

### Memperbaiki format kode

```bash
npm run format
```

## 8. Struktur File Frontend

```text
client/
|-- login.html
|-- register.html
|-- auth.js
|-- validators.js
|-- eslint.config.js
|-- package.json
`-- tests/
    `-- validators.test.js
```

Keterangan:

- `login.html`: halaman antarmuka Login.
- `register.html`: halaman antarmuka Register.
- `auth.js`: menangani interaksi dan pengiriman form.
- `validators.js`: berisi fungsi validasi input.
- `eslint.config.js`: konfigurasi pemeriksaan kualitas kode.
- `package.json`: konfigurasi dependensi dan perintah frontend.
- `tests/validators.test.js`: kumpulan pengujian unit validasi.

## 9. Batasan Implementasi

Implementasi frontend saat ini telah menyediakan antarmuka Login dan Register serta validasi input pada sisi client.

Namun, integrasi backend autentikasi belum tersedia. Oleh karena itu, keberhasilan validasi belum berarti pengguna berhasil login atau akun baru telah tersimpan ke database.

Pengembangan berikutnya dapat mencakup integrasi API autentikasi, penyimpanan akun, dan pengelolaan sesi pengguna.

## 10. Kesimpulan

Dokumentasi UI frontend Moodbox menjelaskan struktur halaman Login dan Register, aturan validasi input, proses kerja JavaScript, serta penggunaan Jest, ESLint, dan Prettier.

Pemisahan fungsi validasi ke dalam `validators.js` memudahkan pemeliharaan kode dan pengujian secara terpisah. Dengan adanya dokumentasi ini, pengembangan frontend diharapkan menjadi lebih terstruktur dan mudah dipahami oleh anggota tim.
