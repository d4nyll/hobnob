function update(req, db, validator, ValidationError) {
  if (req.params.userId !== req.user.id) {
    return Promise.reject(new Error('Forbidden'));
  }
  const validationResults = validator(req);
  if (validationResults instanceof ValidationError) {
    return Promise.reject(validationResults);
  }
  return db.update({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    id: req.params.userId,
    body: {
      doc: {
        profile: req.body,
      },
    },
  }).then(() => undefined)
    .catch((err) => {
      if (err.status === 404) {
        return Promise.reject(new Error('Not Found'));
      }
      return Promise.reject(new Error('Internal Server Error'));
    });
}

export default update;
