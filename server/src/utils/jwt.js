const jwt = require('jsonwebtoken');

function signAccessToken(user) {
  if (!process.env.JWT_SECRET) {
    throw Object.assign(new Error('Missing JWT_SECRET'), { statusCode: 500 });
  }
  return jwt.sign(
    { sub: user.id || user._id?.toString(), role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

module.exports = { signAccessToken };

