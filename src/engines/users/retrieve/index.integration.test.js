import assert from 'assert';
import elasticsearch from 'elasticsearch';
import retrieve from '.';

const db = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});

const USER_ID = 'TEST_USER_ID';
const RETRIEVE_USER_OBJ = {
  email: 'e@ma.il',
};

describe('Engine - User - Retrieve', function () {
  const req = {
    params: {
      userId: USER_ID,
    },
  };
  let promise;
  describe('When the user does not exists', function () {
    beforeEach(function () {
      promise = retrieve(req, db);
    });
    it('should return with a promise that rejects with an Error object', function () {
      promise.catch(err => assert(err instanceof Error));
    });
    it("that has the mesage 'Not Found'", function () {
      promise.catch(err => assert.equal(err.message, 'Not Found'));
    });
  });
  describe('When the user exists', function () {
    beforeEach(function () {
      // Creates a user with _id set to USER_ID
      promise = db.index({
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: USER_ID,
        body: RETRIEVE_USER_OBJ,
      }).then(() => retrieve(req, db));
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
      it('to an object that matches USER_OBJ', function () {
        return promise.then(res => assert.deepEqual(res, RETRIEVE_USER_OBJ));
      });
    });
  });
});
