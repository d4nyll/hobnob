function retrieveUser(req, res, db, retrieve) {
  return retrieve(req, db).then((result) => {
    res.status(200);
    res.set('Content-Type', 'application/json');
    return res.send(result);
  }).catch((err) => {
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

export default retrieveUser;
