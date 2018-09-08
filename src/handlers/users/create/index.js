function createUser(req, res, db, create, validator, ValidationError) {
  return create(req, db, validator, ValidationError).then((result) => {
    res.status(201);
    res.set('Content-Type', 'text/plain');
    return res.send(result._id);
  }, (err) => {
    if (err instanceof ValidationError) {
      res.status(400);
      res.set('Content-Type', 'application/json');
      return res.json({ message: err.message });
    }
    return undefined;
  }).catch(() => {
    res.status(500);
    res.set('Content-Type', 'application/json');
    return res.json({ message: 'Internal Server Error' });
  });
}

export default createUser;
