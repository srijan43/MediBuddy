function notFound(req, res, next) {
  res.status(404).json({ error: { message: 'Not found', status: 404 } });
}

module.exports = { notFound };

