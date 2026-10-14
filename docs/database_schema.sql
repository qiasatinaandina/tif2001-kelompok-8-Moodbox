   -- ============================================
   -- Moodbox - Database Schema (Sprint 1)
   -- DBMS: PostgreSQL (Supabase)
   -- ============================================

   CREATE TABLE users (
     -- id: identitas unik pengguna (UUID dibuat otomatis)
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

     -- name: nama lengkap pengguna
     name VARCHAR(100) NOT NULL,

     -- email: alamat email, harus unik, dipakai untuk login
     email VARCHAR(150) UNIQUE NOT NULL,

     -- password: hash bcrypt (BUKAN teks asli)
     password VARCHAR(255) NOT NULL,

     -- role: 'user' (pelanggan studio) atau 'admin' (pengelola Moodbox)
     role VARCHAR(20) DEFAULT 'user',

     -- created_at: waktu akun dibuat
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );