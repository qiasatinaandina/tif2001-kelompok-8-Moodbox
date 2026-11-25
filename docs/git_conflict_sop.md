# SOP Resolusi Konflik Git - Moodbox

## A. Dengan git merge (utama untuk tim)
1. git status, lalu commit pekerjaan lokal.
2. git checkout main, lalu git pull --no-edit origin main.
3. git checkout <branch-fitur>, lalu git merge main.
4. Buka file konflik, hapus penanda <<<<<<<, =======, >>>>>>>, gabungkan logikanya, jalankan npm test.
5. git add ., git commit -m "chore(merge): resolve conflict", git push origin <branch-fitur>.

## B. Dengan git rebase (riwayat bersih)
1. git fetch origin, lalu git rebase origin/main.
2. Perbaiki file konflik, git add <file>, git rebase --continue (jangan git commit).
3. Batal: git rebase --abort.
4. Push: git push --force-with-lease origin <branch-fitur> (hanya branch pribadi, jangan pernah ke main).

## C. Aturan
- Jangan push langsung ke main.
- Jika .env ter-commit: git rm --cached server/.env, tambahkan ke .gitignore, lalu ganti password DB dan JWT_SECRET.
