// auth middleware extracted for unit testing
function authMiddleware(req, res, next) {
  const auth = req.header && (req.header('authorization') || req.header('Authorization'));
  if (!auth) return next();
  const parts = auth.split(' ');
  const token = parts.length === 2 ? parts[1] : parts[0];
  if (!token) return next();
  req.user = { id: token };
  return next();
}

module.exports = authMiddleware;
