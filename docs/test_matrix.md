# Authentication Test Scenario Matrix

## Ringkasan
- Server: 4 suite, 27 test, semua lolos
- Client: menunggu merge PR frontend (script test belum tersedia di main)

## Skenario Server
| ID | File Test | Skenario | Tipe | Hasil |
|----|-----------|----------|------|-------|
| T01 | password.test.js | Hashing password | Positive | Pass |
| T02 | token.test.js | Penerbitan token JWT | Positive | Pass |
| T03 | verifyToken.test.js | Token tidak valid ditolak | Negative | Pass |
| T04 | auth.test.js | Register dan login | Positive/Negative | Pass |