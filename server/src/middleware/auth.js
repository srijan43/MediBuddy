const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');
  if (!token) return next(Object.assign(new Error('Unauthorized'), { statusCode: 401 }));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (e) {
    return next(Object.assign(new Error('Unauthorized'), { statusCode: 401 }));
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(Object.assign(new Error('Unauthorized'), { statusCode: 401 }));
    if (!roles.includes(req.user.role)) {
      return next(Object.assign(new Error('Forbidden'), { statusCode: 403 }));
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };

