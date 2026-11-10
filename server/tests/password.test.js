const { hashPassword, comparePassword } = require('../src/utils/password');

describe('hashPassword', () => {
  it('menghasilkan hash yang berbeda dari teks asli', async () => {
    const hashed = await hashPassword('rahasia123');
    expect(hashed).not.toBe('rahasia123');
  });

  it('menghasilkan hash bcrypt dengan salt rounds 10', async () => {
    const hashed = await hashPassword('rahasia123');
    expect(hashed.startsWith('$2')).toBe(true);
    expect(hashed).toContain('$10$');
  });

  it('password sama menghasilkan hash berbeda (salt acak)', async () => {
    const a = await hashPassword('rahasia123');
    const b = await hashPassword('rahasia123');
    expect(a).not.toBe(b);
  });
});

describe('comparePassword', () => {
  it('true untuk password yang benar', async () => {
    const hashed = await hashPassword('rahasia123');
    expect(await comparePassword('rahasia123', hashed)).toBe(true);
  });

  it('false untuk password yang salah', async () => {
    const hashed = await hashPassword('rahasia123');
    expect(await comparePassword('salahbanget', hashed)).toBe(false);
  });

  it('false untuk string kosong', async () => {
    const hashed = await hashPassword('rahasia123');
    expect(await comparePassword('', hashed)).toBe(false);
  });
});
