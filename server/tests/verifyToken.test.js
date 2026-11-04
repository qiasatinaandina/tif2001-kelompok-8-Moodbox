process.env.JWT_SECRET = 'test_secret';

const jwt = require('jsonwebtoken');
const verifyToken = require('../src/middlewares/verifyToken');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('verifyToken middleware', () => {
  it('menolak request tanpa header Authorization', () => {
    const res = mockRes();
    const next = jest.fn();
    verifyToken({ headers: {} }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('menolak token palsu', () => {
    const res = mockRes();
    const next = jest.fn();
    verifyToken({ headers: { authorization: 'Bearer palsu' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('memanggil next() dan mengisi req.user jika token valid', () => {
    const token = jwt.sign({ id: 'u1', role: 'user' }, 'test_secret');
    const req = { headers: { authorization: `Bearer ${token}` } };
    const next = jest.fn();
    verifyToken(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user.id).toBe('u1');
  });
});
