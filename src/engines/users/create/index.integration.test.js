import assert from 'assert';
import elasticsearch from 'elasticsearch';
import ValidationError from '../../../validators/errors/validation-error';
import createUserValidator from '../../../validators/users/create';
import create from '.';

const db = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});

describe('Engine - User - Create', function () {
  describe('When invoked with invalid req', function () {
    it('should return promise that rejects with an instance of ValidationError', function () {
      const req = {};
      return create(req, db, createUserValidator, ValidationError)
        .catch(err => assert(err instanceof ValidationError));
    });
  });
  describe('When invoked with valid req', function () {
    it('should return a success object containing the user ID', function () {
      const req = {
        body: {
          email: 'e@ma.il',
          digest: '$2y$10$6.5uPfJUCQlcuLO/SNVX3u1yU6LZv.39qOzshHXJVpaq3tJkTwiAy',
          profile: {},
        },
      };
      return create(req, db, createUserValidator, ValidationError)
        .then((result) => {
          assert.equal(typeof result, 'string');
        });
    });
  });
});
