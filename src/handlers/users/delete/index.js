function del(req, res, db, engine) {
  return engine(req, db)
    .then(() => {
      res.status(200);
      res.set('Content-Type', 'text/plain');
      return res.send();
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        res.status(404);
        res.set('Content-Type', 'application/json');
        return res.json({ message: err.message });
      }
      if (err.message === 'Forbidden') {
        res.status(403);
        res.set('Content-Type', 'application/json');
        return res.json({ message: 'Permission Denied. Can only delete yourself, not other users.' });
      }
      res.status(500);
      res.set('Content-Type', 'application/json');
      return res.json({ message: 'Internal Server Error' });
    });
}

export default del;
