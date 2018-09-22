import assert from 'assert';
import generateESClientDeleteStub from '../../../tests/stubs/elasticsearch/client/delete';
import del from '.';

const TEST_USER_ID = 'TEST_USER_ID';
const req = {
  params: {
    userId: TEST_USER_ID,
  },
  user: {
    id: TEST_USER_ID,
  },
};
let db;
let promise;

describe('Engine - User - Delete', function () {
  describe('When invoked', function () {
    beforeEach(function () {
      db = { delete: generateESClientDeleteStub.success() };
      promise = del(req, db);
      return promise;
    });

    it("should call the client instance's get method with the correct params", function () {
      assert.deepEqual(db.delete.getCall(0).args[0], {
        index: process.env.ELASTICSEARCH_INDEX,
        type: 'user',
        id: TEST_USER_ID,
      });
    });
  });
  describe('When the client.delete operation is successful', function () {
    beforeEach(function () {
      db = { delete: generateESClientDeleteStub.success() };
      promise = del(req, db);
      return promise;
    });
    it('should return with a promise that resolves to undefined', function () {
      return promise.then(res => assert(typeof res === 'undefined'));
    });
  });
  describe('When the client.delete operation is unsuccessful', function () {
    describe('Because the user does not exists', function () {
      beforeEach(function () {
        db = { delete: generateESClientDeleteStub.notFound() };
        promise = del(req, db);
      });
      it('should return with a promise that rejects with an Error object', function () {
        return promise.catch(error => assert(error instanceof Error));
      });
      it("which has a message property set to 'Not Found'", function () {
        return promise.catch(error => assert.equal(error.message, 'Not Found'));
      });
    });
    describe('Because of other errors', function () {
      beforeEach(function () {
        db = { delete: generateESClientDeleteStub.failure() };
        promise = del(req, db);
      });
      it('should return with a promise that rejects with an Error object', function () {
        return promise.catch(error => assert(error instanceof Error));
      });
      it("which has a message property set to 'Internal Server Error'", function () {
        return promise.catch(error => assert.equal(error.message, 'Internal Server Error'));
      });
    });
  });
});
