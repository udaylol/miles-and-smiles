import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';

export const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, JWT_SECRET, {
    expiresIn: '1d',
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
