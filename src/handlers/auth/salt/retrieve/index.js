function retrieveSalt(req, res, db, engine, _validator, getSalt, generateFakeSalt) {
  return engine(req, db, getSalt, generateFakeSalt).then((result) => {
    res.status(200);
    res.set('Content-Type', 'text/plain');
    return res.send(result);
  }, (err) => {
    if (err.message === 'Email not specified') {
      res.status(400);
      res.set('Content-Type', 'application/json');
      return res.json({ message: 'The email field must be specified' });
    }
    throw err;
  }).catch(() => {
    res.status(500);
    res.set('Content-Type', 'application/json');
    return res.json({ message: 'Internal Server Error' });
  });
}

export default retrieveSalt;
