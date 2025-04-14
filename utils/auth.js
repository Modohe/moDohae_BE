const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; 

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    return null;
  }
};

module.exports = { verifyToken };
