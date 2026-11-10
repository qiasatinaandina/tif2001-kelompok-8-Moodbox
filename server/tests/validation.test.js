process.env.JWT_SECRET = 'test_secret';

jest.mock('../src/config/db', () => ({ query: jest.fn() }));

const request = require('supertest');
const pool = require('../src/config/db');
const app = require('../src/app');

const validUser = { name: 'Budi Santoso', email: 'budi@contoh.com', password: 'rahasia123' };

beforeEach(() => {
  pool.query.mockReset();
});

describe('Validasi register', () => {
  it('400 jika nama kurang dari 2 karakter', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, name: 'A' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Nama minimal 2 karakter');
  });

  it('400 jika nama lebih dari 100 karakter', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, name: 'a'.repeat(101) });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Nama maksimal 100 karakter');
  });

  it('400 jika password bukan teks', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, password: 123456789 });
    expect(res.status).toBe(400);
  });

  it('400 jika password lebih dari 72 karakter', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, password: 'a'.repeat(73) });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Kata sandi maksimal 72 karakter');
  });

  it('400 jika body kosong', async () => {
    const res = await request(app).post('/api/v1/auth/register');
    expect(res.status).toBe(400);
  });

  it('email di-trim dan diubah ke huruf kecil sebelum disimpan', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({
      rows: [{ id: 'u1', name: 'Budi Santoso', email: 'budi@contoh.com', role: 'user' }],
    });
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, email: '  Budi@Contoh.COM ' });
    expect(res.status).toBe(201);
    expect(pool.query.mock.calls[0][1]).toEqual(['budi@contoh.com']);
  });

  it('field confirmPassword dari frontend diabaikan', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({
      rows: [{ id: 'u1', name: 'Budi Santoso', email: 'budi@contoh.com', role: 'user' }],
    });
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...validUser, confirmPassword: 'rahasia123' });
    expect(res.status).toBe(201);
  });
});

describe('Validasi login', () => {
  it('400 jika email bukan teks', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 12345, password: 'rahasia123' });
    expect(res.status).toBe(400);
  });

  it('400 jika body kosong', async () => {
    const res = await request(app).post('/api/v1/auth/login');
    expect(res.status).toBe(400);
  });
});

describe('GET /api/v1/health', () => {
  it('200 dan status ok', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
