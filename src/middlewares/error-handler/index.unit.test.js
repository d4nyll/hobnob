import assert from 'assert';
import deepClone from 'lodash.clonedeep';
import deepEqual from 'lodash.isequal';
import { spy, stub } from 'sinon';
import errorHandler from '.';

function getValidError(constructor = SyntaxError) {
  const error = new constructor();
  error.status = 400;
  error.body = {};
  error.type = 'entity.parse.failed';
  return error;
}

describe('errorHandler', function () {
  let err;
  let req;
  let res;
  let next;
  let clonedRes;
  describe('When the error is not an instance of SyntaxError', function () {
    beforeEach(function () {
      err = getValidError(Error);
      req = {};
      res = {};
      clonedRes = deepClone(res);
      next = spy();
      errorHandler(err, req, res, next);
    });

    it('should not modify res', function () {
      assert(deepEqual(res, clonedRes));
    });
    it('should call next() once', function () {
      assert(next.calledOnce);
    });
  });

  describe('When the error status is not 400', function () {
    beforeEach(function () {
      err = getValidError();
      err.status = 401;
      req = {};
      res = {};
      clonedRes = deepClone(res);
      next = spy();
      errorHandler(err, req, res, next);
    });

    it('should not modify res', function () {
      assert(deepEqual(res, clonedRes));
    });

    it('should call next() once', function () {
      assert(next.calledOnce);
    });
  });

  describe('When the error does not contain a `body` property', function () {
    beforeEach(function () {
      err = getValidError();
      delete err.body;
      req = {};
      res = {};
      clonedRes = deepClone(res);
      next = spy();
      errorHandler(err, req, res, next);
    });

    it('should not modify res', function () {
      assert(deepEqual(res, clonedRes));
    });

    it('should call next() once', function () {
      assert(next.calledOnce);
    });
  });

  describe('When the error type is not `entity.parse.failed`', function () {
    beforeEach(function () {
      err = getValidError();
      err.type = 'foo';
      req = {};
      res = {};
      clonedRes = deepClone(res);
      next = spy();
      errorHandler(err, req, res, next);
    });

    it('should not modify res', function () {
      assert(deepEqual(res, clonedRes));
    });

    it('should call next() once', function () {
      assert(next.calledOnce);
    });
  });

  describe('When the error is a SyntaxError, with a 400 status, has a `body` property set, and has type `entity.parse.failed`', function () {
    let resJsonReturnValue;
    let returnedValue;

    beforeEach(function () {
      err = getValidError();
      req = {};
      resJsonReturnValue = {};
      res = {
        status: spy(),
        set: spy(),
        json: stub().returns(resJsonReturnValue),
      };
      next = spy();
      returnedValue = errorHandler(err, req, res, next);
    });

    describe('should call res.status()', function () {
      it('once', function () {
        assert(res.status.calledOnce);
      });
      it('with the argument 400', function () {
        assert(res.status.calledWithExactly(400));
      });
    });

    describe('should call res.set()', function () {
      it('once', function () {
        assert(res.set.calledOnce);
      });
      it('with the arguments "Content-Type" and "application/json"', function () {
        assert(res.set.calledWithExactly('Content-Type', 'application/json'));
      });
    });

    describe('should call res.json()', function () {
      it('once', function () {
        assert(res.json.calledOnce);
      });
      it('with the correct error object', function () {
        assert(res.json.calledWithExactly({ message: 'Payload should be in JSON format' }));
      });
    });

    it('should return whatever res.json() returns', function () {
      assert.strictEqual(returnedValue, resJsonReturnValue);
    });

    it('should not call next()', function () {
      assert(next.notCalled);
    });
  });
});
