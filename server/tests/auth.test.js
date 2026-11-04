process.env.JWT_SECRET = 'test_secret';

jest.mock('../src/config/db', () => ({ query: jest.fn() }));

const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../src/config/db');
const app = require('../src/app');

const validUser = { name: 'Budi Santoso', email: 'budi@contoh.com', password: 'rahasia123' };

beforeEach(() => {
  pool.query.mockReset();
});

describe('POST /api/v1/auth/register', () => {
  it('400 jika field kosong', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
  });

  it('400 jika format email tidak valid', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, email: 'salah' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Format email tidak valid');
  });

  it('400 jika password kurang dari 8 karakter', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, password: '123' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Kata sandi minimal 8 karakter');
  });

  it('409 jika email sudah terdaftar', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 'u1' }] });
    const res = await request(app).post('/api/v1/auth/register').send(validUser);
    expect(res.status).toBe(409);
  });

  it('201 jika sukses, password di-hash dan tidak dikembalikan', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({
      rows: [{ id: 'u1', name: 'Budi Santoso', email: 'budi@contoh.com', role: 'user' }],
    });
    const res = await request(app).post('/api/v1/auth/register').send(validUser);
    expect(res.status).toBe(201);
    expect(res.body.data.password).toBeUndefined();
    const savedPassword = pool.query.mock.calls[1][1][2];
    expect(savedPassword).not.toBe('rahasia123');
    expect(savedPassword.startsWith('$2')).toBe(true);
  });

  it('500 jika database error', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    pool.query.mockRejectedValueOnce(new Error('db down'));
    const res = await request(app).post('/api/v1/auth/register').send(validUser);
    expect(res.status).toBe(500);
    spy.mockRestore();
  });
});

describe('POST /api/v1/auth/login', () => {
  const dbUser = {
    id: 'u1',
    name: 'Budi Santoso',
    email: 'budi@contoh.com',
    role: 'user',
    password: bcrypt.hashSync('rahasia123', 10),
  };

  it('400 jika email atau password kosong', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
  });

  it('401 jika email tidak ditemukan', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'x@y.com', password: 'rahasia123' });
    expect(res.status).toBe(401);
  });

  it('401 jika password salah', async () => {
    pool.query.mockResolvedValueOnce({ rows: [dbUser] });
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: dbUser.email, password: 'salahbanget' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Email atau kata sandi salah');
  });

  it('200 + token JWT berlaku 24 jam jika login benar', async () => {
    pool.query.mockResolvedValueOnce({ rows: [dbUser] });
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: dbUser.email, password: 'rahasia123' });
    expect(res.status).toBe(200);
    expect(res.body.user.password).toBeUndefined();
    const decoded = jwt.verify(res.body.token, 'test_secret');
    expect(decoded.email).toBe(dbUser.email);
    expect(decoded.exp - decoded.iat).toBe(24 * 60 * 60);
  });
});

describe('GET /api/v1/auth/me', () => {
  it('401 tanpa token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('401 dengan token tidak valid', async () => {
    const res = await request(app).get('/api/v1/auth/me').set('Authorization', 'Bearer ngawur');
    expect(res.status).toBe(401);
  });

  it('200 dengan token valid', async () => {
    const token = jwt.sign({ id: 'u1', email: 'budi@contoh.com', role: 'user' }, 'test_secret');
    const res = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('budi@contoh.com');
  });
});
