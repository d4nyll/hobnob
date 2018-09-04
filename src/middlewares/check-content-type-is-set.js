function checkContentTypeIsSet(req, res, next) {
  if (
    req.headers['content-length'] !== '0'
    && !req.headers['content-type']
  ) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    res.json({ message: 'The "Content-Type" header must be set for requests with a non-empty payload' });
  }
  next();
}

export default checkContentTypeIsSet;
