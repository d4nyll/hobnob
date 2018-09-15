import assert from 'assert';
import { match } from 'sinon';
import generateResSpy from '../../../tests/spies/res';
import generateDeleteUserStubs from '../../../tests/stubs/engines/users/delete';
import del from '.';

describe('Handler - Users - Delete', function () {
  const db = {};
  const req = {};
  let res;
  describe('When called with valid request object', function () {
    beforeEach(function () {
      res = generateResSpy();
      const engine = generateDeleteUserStubs().success;
      return del(req, res, db, engine);
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
    it('should res.set() with a text/plain content-type header', function () {
      assert(res.set.calledWithExactly('Content-Type', 'text/plain'));
    });

    it('should call res.send() once', function () {
      assert(res.send.calledOnce);
    });
    it('should call res.send() with no arguments', function () {
      assert(res.send.calledWithExactly());
    });
  });
  describe('When the user cannot be found', function () {
    beforeEach(function () {
      res = generateResSpy();
      const engine = generateDeleteUserStubs().notFoundError;
      return del(req, res, db, engine);
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
  describe('When deleteUser throws an unexpected error', function () {
    beforeEach(function () {
      res = generateResSpy();
      const engine = generateDeleteUserStubs().genericError;
      return del(req, res, db, engine);
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
