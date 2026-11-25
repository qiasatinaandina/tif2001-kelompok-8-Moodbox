CREATE TABLE IF NOT EXISTS categories (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS packages (
  id           SERIAL PRIMARY KEY,
  category_id  INT REFERENCES categories(id) ON DELETE SET NULL,
  name         VARCHAR(150) NOT NULL,
  description  TEXT,
  price        INT NOT NULL CHECK (price >= 0),
  duration_min INT NOT NULL CHECK (duration_min > 0),
  max_pax      INT NOT NULL CHECK (max_pax > 0),
  image_url    TEXT,
  image_path   TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_packages_category ON packages(category_id);

-- Untuk middleware admin (lewati jika kolom role sudah ada)
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'customer';

-- Data awal dari mockup
INSERT INTO categories (name) VALUES
  ('Solo / Personal'), ('Duo / Bestie'), ('Group / Family'),
  ('Graduation Special'), ('Prewedding & Couple')
ON CONFLICT (name) DO NOTHING;

INSERT INTO packages (category_id, name, description, price, duration_min, max_pax)
SELECT c.id, v.name, v.description, v.price, v.duration_min, v.max_pax
FROM (VALUES
  ('Solo / Personal', 'Solo Signature', 'Potret diri santai & ekspresif', 95000, 20, 1),
  ('Duo / Bestie', 'The Duo Mood', 'Untuk 2 orang sahabat atau pasangan', 150000, 25, 2),
  ('Group / Family', 'Squad Celebration', 'Geng seru, perpisahan, & keluarga', 250000, 35, 6)
) AS v(cat, name, description, price, duration_min, max_pax)
JOIN categories c ON c.name = v.cat;
UPDATE users SET role = 'admin' WHERE email = 'qiasatiaandina@gmail.com';