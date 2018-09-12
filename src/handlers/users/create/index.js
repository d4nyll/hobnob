function createUser(req, res, db, create, validator, ValidationError) {
  return create(req, db, validator, ValidationError).then((userId) => {
    res.status(201);
    res.set('Content-Type', 'text/plain');
    return res.send(userId);
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

export default createUser;
