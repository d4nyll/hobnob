import assert from 'assert';
import generateESClientGetStub from '../../../tests/stubs/elasticsearch/client/get';
import retrieve from '.';

const TEST_USER_ID = 'TEST_USER_ID';
const req = {
  params: {
    userId: TEST_USER_ID,
  },
};

describe('Engine - User - Retrieve', function () {
  let db;
  let promise;
  describe('When invoked', function () {
    before(function () {
      db = {
        get: generateESClientGetStub.success(),
      };
      return retrieve(req, db);
    });

    it("should call the client instance's get method with the correct params", function () {
      assert.deepEqual(db.get.getCall(0).args[0], {
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: TEST_USER_ID,
      });
    });
  });
  describe('When the client.get operation is successful', function () {
    beforeEach(function () {
      db = {
        get: generateESClientGetStub.success(),
      };
      promise = retrieve(req, db);
    });
    it('should return with a promise that resolves to an object', function () {
      promise.then(res => assert(typeof res === 'object'));
    });
  });
  describe('When the client.get operation is unsuccessful', function () {
    describe('Because the user does not exists', function () {
      beforeEach(function () {
        db = {
          get: generateESClientGetStub.notFound(),
        };
        promise = retrieve(req, db);
      });
      it('should return with a promise that rejects with an Error object', function () {
        promise.catch(error => assert(error instanceof Error));
      });
      it("which has a message property set to 'Not Found'", function () {
        promise.catch(error => assert.equal(error.message, 'Not Found'));
      });
    });
    describe('Because of other errors', function () {
      beforeEach(function () {
        db = {
          get: generateESClientGetStub.failure(),
        };
        promise = retrieve(req, db);
      });
      it('should return with a promise that rejects with an Error object', function () {
        promise.catch(error => assert(error instanceof Error));
      });
      it("which has a message property set to 'Internal Server Error'", function () {
        promise.catch(error => assert.equal(error.message, 'Internal Server Error'));
      });
    });
  });
});
