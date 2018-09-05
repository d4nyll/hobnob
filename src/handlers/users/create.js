import ValidationError from '../../validators/errors/validation-error';
import validate from '../../validators/users/create';

function createUser(req, res, db) {
  const validationResults = validate(req);
  if (validationResults instanceof ValidationError) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    res.json({ message: validationResults.message });
    return;
  }
  db.index({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    body: req.body,
  }).then((result) => {
    res.status(201);
    res.set('Content-Type', 'text/plain');
    res.send(result._id);
  }).catch(() => {
    res.status(500);
    res.set('Content-Type', 'application/json');
    res.json({ message: 'Internal Server Error' });
  });
}

export default createUser;
