function search(req, res, db, engine, validator, ValidationError) {
  return engine(req, db, validator, ValidationError).then((result) => {
    res.status(200);
    res.set('Content-Type', 'application/json');
    return res.json(result);
  }, (err) => {
    if (err instanceof ValidationError) {
      res.status(400);
      res.set('Content-Type', 'application/json');
      return res.json({ message: err.message });
    }
    throw err;
  }).catch(() => {
    res.status(500);
    res.set('Content-Type', 'application/json');
    return res.json({ message: 'Internal Server Error' });
  });
}

export default search;
