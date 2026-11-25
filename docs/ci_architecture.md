# CI Architecture - Moodbox

## Tujuan
Memeriksa kualitas dan format kode secara otomatis pada setiap Pull Request sebelum di-merge ke `main`.

## Trigger
| Event | Branch target |
|---|---|
| `pull_request` | `main` |

## Daftar Job
| Job | Folder | Langkah |
|---|---|---|
| `lint-server` | `server/` | checkout → setup Node 20 → `npm ci` → `npm run lint` → `npm run format:check` |
| `lint-client` | `client/` | checkout → setup Node 20 → `npm ci` → `npm run lint` → `npm run format:check` |

## Aturan Status Check
- PR hanya boleh di-merge jika semua job berstatus hijau (passed).
- Branch protection yang mewajibkan status check diaktifkan pada Pertemuan 8.

## Cara Membaca Hasil
1. Buka PR, lihat bagian **Checks** di bawah.
2. Silang merah: klik **Details**, buka langkah yang gagal, baca log.
3. Perbaiki kode, commit, push. CI berjalan ulang otomatis.

## Prasyarat Tiap Folder
- `package.json` dengan script `lint` dan `format:check`
- `package-lock.json` ter-commit

## Workflow Lain
- `cd.yml`: placeholder, hanya dipicu manual (`workflow_dispatch`). Deployment belum dikonfigurasi.

## Job Unit Test (Pertemuan 8)

| Job | Nama Status Check | Perintah | Status |
|-----|-------------------|----------|--------|
| test-server | Test Backend | npm test (server) | Aktif |
| test-client | Test Frontend | npm test (client) | Menunggu merge PR frontend |

## Aturan Status Check di `main`
- Trigger: pull_request ke `main`
- Required check: `Test Backend` (`Test Frontend` ditambahkan setelah jobnya ada)
- `Lint Frontend` belum diwajibkan karena format:check client masih gagal