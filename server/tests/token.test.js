process.env.JWT_SECRET = 'test_secret';

const jwt = require('jsonwebtoken');
const { generateToken } = require('../src/utils/token');

const user = { id: 'u1', email: 'budi@contoh.com', role: 'user', password: 'hash' };

describe('generateToken', () => {
  it('menghasilkan string JWT tiga bagian', () => {
    const token = generateToken(user);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('payload berisi id, email, dan role', () => {
    const decoded = jwt.verify(generateToken(user), 'test_secret');
    expect(decoded.id).toBe('u1');
    expect(decoded.email).toBe('budi@contoh.com');
    expect(decoded.role).toBe('user');
  });

  it('payload tidak memuat password', () => {
    const decoded = jwt.verify(generateToken(user), 'test_secret');
    expect(decoded.password).toBeUndefined();
  });

  it('masa berlaku tepat 24 jam', () => {
    const decoded = jwt.verify(generateToken(user), 'test_secret');
    expect(decoded.exp - decoded.iat).toBe(24 * 60 * 60);
  });

  it('ditolak jika diverifikasi dengan secret yang salah', () => {
    const token = generateToken(user);
    expect(() => jwt.verify(token, 'secret_salah')).toThrow();
  });
});
