const NO_RESULTS_ERROR_MESSAGE = 'no-results';

function retrieveSalt(req, db, getSalt, generateFakeSalt) {
  if (!req.query.email) {
    return Promise.reject(new Error('Email not specified'));
  }
  return db.search({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    body: {
      query: {
        match: {
          email: req.query.email,
        },
      },
    },
    _sourceInclude: 'digest',
  }).then((res) => {
    const user = res.hits.hits[0];
    return user
      ? user._source.digest
      : Promise.reject(new Error(NO_RESULTS_ERROR_MESSAGE));
  }).then(getSalt)
    .catch((err) => {
      if (err.message === NO_RESULTS_ERROR_MESSAGE) {
        return generateFakeSalt(req.query.email);
      }
      return Promise.reject(new Error('Internal Server Error'));
    });
}

export default retrieveSalt;
