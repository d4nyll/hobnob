function create(req, db, validator, ValidationError) {
  const validationResults = validator(req);
  if (validationResults instanceof ValidationError) {
    return Promise.reject(validationResults);
  }
  return db.index({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    body: req.body,
  });
}

export default create;
