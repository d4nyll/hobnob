import assert from 'assert';
import { match } from 'sinon';
import generateResSpy from '../../../tests/spies/res';
import generateRetrieveUserStubs, { RETRIEVE_USER_RESPONSE_OBJECT } from '../../../tests/stubs/engines/users/retrieve';
import retrieve from '.';

describe('Handler - Users - Retrieve', function () {
  const db = {};
  const req = {};
  let res;
  let engine;
  beforeEach(function () {
    res = generateResSpy();
  });
  describe('When called with valid request object', function () {
    beforeEach(function () {
      engine = generateRetrieveUserStubs().success;
      return retrieve(req, res, db, engine);
    });

    it('should call res.status() once', function () {
      assert(res.status.calledOnce);
    });
    it('should call res.status() with 200', function () {
      assert(res.status.calledWithExactly(200));
    });

    it('should res.set() once', function () {
      assert(res.set.calledOnce);
    });
    it('should res.set() with a application/json content-type header', function () {
      assert(res.set.calledWithExactly('Content-Type', 'application/json'));
    });

    it('should call res.send() once', function () {
      assert(res.send.calledOnce);
    });
    it('should call res.send() with the object returned from retrieveUser', function () {
      assert(res.send.calledWithExactly(RETRIEVE_USER_RESPONSE_OBJECT));
    });
  });
  describe('When the user cannot be found', function () {
    beforeEach(function () {
      engine = generateRetrieveUserStubs().notFoundError;
      return retrieve(req, res, db, engine);
    });

    it('should call res.status() once', function () {
      assert(res.status.calledOnce);
    });
    it('should call res.status() with 404', function () {
      assert(res.status.calledWithExactly(404));
    });

    it('should res.set() once', function () {
      assert(res.set.calledOnce);
    });
    it('should res.set() with a application/json content-type header', function () {
      assert(res.set.calledWithExactly('Content-Type', 'application/json'));
    });

    it('should call res.json() once', function () {
      assert(res.json.calledOnce);
    });
    it('should call res.json() with an error object with message "Not Found"', function () {
      assert(res.json.calledWithExactly(match.has('message', 'Not Found')));
    });
  });
  describe('When retrieveUser throws an unexpected error', function () {
    beforeEach(function () {
      engine = generateRetrieveUserStubs().genericError;
      return retrieve(req, res, db, engine);
    });

    it('should call res.status() once', function () {
      assert(res.status.calledOnce);
    });
    it('should call res.status() with 500', function () {
      assert(res.status.calledWithExactly(500));
    });

    it('should res.set() once', function () {
      assert(res.set.calledOnce);
    });
    it('should res.set() with a application/json content-type header', function () {
      assert(res.set.calledWithExactly('Content-Type', 'application/json'));
    });

    it('should call res.json() once', function () {
      assert(res.json.calledOnce);
    });
    it('should call res.json() with an error object with message "Internal Server Error"', function () {
      assert(res.json.calledWithExactly(match.has('message', 'Internal Server Error')));
    });
  });
});
