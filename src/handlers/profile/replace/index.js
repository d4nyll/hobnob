function replace(req, res, db, engine, validator, ValidationError) {
  return engine(req, db, validator, ValidationError).then(() => {
    res.status(200);
    res.set('Content-Type', 'text/plain');
    return res.send();
  }).catch((err) => {
    if (err instanceof ValidationError) {
      res.status(400);
      res.set('Content-Type', 'application/json');
      return res.json({ message: err.message });
    }
    if (err.message === 'Not Found') {
      res.status(404);
      res.set('Content-Type', 'application/json');
      return res.json({ message: err.message });
    }
    res.status(500);
    res.set('Content-Type', 'application/json');
    return res.json({ message: 'Internal Server Error' });
  });
}

export default replace;
