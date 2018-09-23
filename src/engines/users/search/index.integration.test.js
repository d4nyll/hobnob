import assert from 'assert';
import elasticsearch from 'elasticsearch';
import ValidationError from '../../../validators/errors/validation-error';
import validator from '../../../validators/users/search';
import search from '.';

const db = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});

const SEARCH_TERM = 'apple banana carrot';
const USER_ID = 'TEST_USER_ID';
const USER_OBJ = {
  email: 'e@ma.il',
  digest: '$2y$10$6.5uPfJUCQlcuLO/SNVX3u1yU6LZv.39qOzshHXJVpaq3tJkTwiAy',
  profile: {
    summary: SEARCH_TERM,
  },
};
const SEARCH_USER_OBJ = {
  email: 'e@ma.il',
  profile: {
    summary: SEARCH_TERM,
  },
};

describe('Engine - User - Search', function () {
  const req = {
    query: {
      query: SEARCH_TERM,
    },
  };
  let promise;
  beforeEach(function () {
    promise = search(req, db, validator, ValidationError);
    return promise;
  });
  describe('When there are no users that matches the search term', function () {
    it('should return with a promise that resolves to an array', function () {
      return promise.then(result => assert(Array.isArray(result)));
    });
    it('which is empty', function () {
      return promise.then(result => assert.equal(result.length, 0));
    });
  });
  describe('When there are users that matches the search term', function () {
    beforeEach(function () {
      // Creates a user with _id set to USER_ID
      return db.index({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: USER_ID,
        body: USER_OBJ,
        refresh: 'true',
      });
    });
    afterEach(function () {
      return db.delete({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: USER_ID,
        refresh: 'true',
      });
    });
    describe('When the Elasticsearch operation is successful', function () {
      beforeEach(function () {
        promise = search(req, db, validator, ValidationError);
        return promise;
      });
      it('should return with a promise that resolves to an array', function () {
        return promise.then(result => assert(Array.isArray(result)));
      });
      it('which is empty', function () {
        return promise.then(result => assert.deepEqual(result[0], SEARCH_USER_OBJ));
      });
    });
  });
});
