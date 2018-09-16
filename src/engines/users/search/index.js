function search(req, db, validator, ValidationError) {
  const validationResults = validator(req);
  if (validationResults instanceof ValidationError) {
    return Promise.reject(validationResults);
  }
  const query = {
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    _sourceExclude: 'password',
  };

  if (req.query.query !== '') {
    query.q = req.query.query;
  }

  return db.search(query)
    .then(res => res.hits.hits.map(hit => hit._source))
    .catch(() => Promise.reject(new Error('Internal Server Error')));
}

export default search;
