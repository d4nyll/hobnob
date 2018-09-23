function login(req, res, db, engine, validator, ValidationError, sign) {
  return engine(req, db, validator, ValidationError, sign)
    .then((result) => {
      res.status(200);
      res.set('Content-Type', 'text/plain');
      return res.send(result);
    })
    .catch((err) => {
      res.set('Content-Type', 'application/json');
      if (err instanceof ValidationError) {
        res.status(400);
        return res.json({ message: err.message });
      }
      if (err.message === 'Not Found') {
        res.status(401);
        return res.json({ message: 'There are no records of an user with this email and password combination' });
      }
      res.status(500);
      return res.json({ message: 'Internal Server Error' });
    });
}

export default login;
