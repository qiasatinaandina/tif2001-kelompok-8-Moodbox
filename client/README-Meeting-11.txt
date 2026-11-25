# Moodbox – Frontend Meeting 11 (Dummy Data)

## Isi paket
- `management.html` – halaman dashboard manajemen paket
- `management.css` – tampilan responsif
- `management.js` – CRUD demo, validasi upload, debounce search, filter kategori, pagination

## Cara memasang
1. Ekstrak ketiga file ke folder `client` pada repository Moodbox.
2. Pastikan ketiga file berada sejajar dengan `index.html`, `login.html`, dan `register.html`.
3. Buka `management.html` melalui VS Code Live Server.
4. Uji tambah/edit/hapus paket, pencarian, filter kategori, pagination, dan upload gambar.

## Catatan
- Data paket menggunakan dummy data di JavaScript dan hanya hidup selama halaman dibuka. Refresh halaman akan mengembalikan data awal.
- Gambar divalidasi di sisi frontend (JPG/PNG/WEBP, maksimal 2 MB) dan ditampilkan sebagai preview. Belum diunggah ke cloud.
- Tidak ada endpoint API yang diasumsikan. Integrasi backend dilakukan setelah kontrak API dari Mhs 2 tersedia.
- Halaman ini terpisah dari file autentikasi dan halaman booking yang sudah ada.
