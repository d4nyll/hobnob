function checkEmptyPayload(req, res, next) {
  if (
    ['POST', 'PATCH', 'PUT'].includes(req.method)
    && req.headers['content-length'] === '0'
  ) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    return res.json({
      message: 'Payload should not be empty',
    });
  }
  return next();
}

export default checkEmptyPayload;
