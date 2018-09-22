import assert from 'assert';
import elasticsearch from 'elasticsearch';
import ValidationError from '../../../validators/errors/validation-error';
import validator from '../../../validators/profile/replace';
import replace from '.';

const USER_ID = 'TEST_USER_ID';
const USER_OBJ = {
  email: 'e@ma.il',
  digest: '$2y$10$6.5uPfJUCQlcuLO/SNVX3u1yU6LZv.39qOzshHXJVpaq3tJkTwiAy',
};
const db = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});

describe('Engine - Profile - Replace', function () {
  let req;
  let promise;
  describe('When the request is not valid', function () {
    beforeEach(function () {
      req = {};
      return replace(req, db, validator, ValidationError)
        .catch(err => assert(err instanceof ValidationError));
    });
  });
  describe('When the request is valid', function () {
    beforeEach(function () {
      req = {
        body: {
          summary: 'summary',
        },
        params: {
          userId: USER_ID,
        },
        user: {
          id: USER_ID,
        },
      };
    });
    describe('When the user does not exists', function () {
      beforeEach(function () {
        promise = replace(req, db, validator, ValidationError);
      });
      it('should return with a promise that rejects with an Error object', function () {
        return promise.catch(err => assert(err instanceof Error));
      });
      it("that has the mesage 'Not Found'", function () {
        return promise.catch(err => assert.equal(err.message, 'Not Found'));
      });
    });
    describe('When the user exists', function () {
      beforeEach(function () {
        // Creates a user with _id set to USER_ID
        promise = db.index({
          index: process.env.ELASTICSEARCH_INDEX,
          type: 'user',
          id: USER_ID,
          body: USER_OBJ,
          refresh: true,
        }).then(() => replace(req, db, validator, ValidationError));
        return promise;
      });
      afterEach(function () {
        return db.delete({
          index: process.env.ELASTICSEARCH_INDEX,
          type: 'user',
          id: USER_ID,
        });
      });
      describe('When the Elasticsearch operation is successful', function () {
        it('should return with a promise that resolves', function () {
          return promise.then(() => assert(true));
        });
        it('to undefined', function () {
          return promise.then(res => res === 'undefined');
        });
        it('should have updated the user profile object', function () {
          return db.get({
            index: process.env.ELASTICSEARCH_INDEX,
            type: 'user',
            id: USER_ID,
          })
            .then(user => user._source)
            .then(user => assert.deepEqual(user, {
              profile: {
                summary: 'summary',
              },
              ...USER_OBJ,
            }));
        });
      });
    });
  });
});
