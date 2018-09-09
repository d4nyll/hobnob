import assert from 'assert';
import { stub } from 'sinon';
import ValidationError from '../../../validators/errors/validation-error';
import create from '.';

describe('User Create Engine', function () {
  let req;
  let db;
  let validator;
  const dbIndexResult = {};
  beforeEach(function () {
    req = {};
    db = {
      index: stub().resolves(dbIndexResult),
    };
  });
  describe('When invoked and validator returns with undefined', function () {
    let promise;
    beforeEach(function () {
      validator = stub().returns(undefined);
      promise = create(req, db, validator, ValidationError);
      return promise;
    });
    describe('should call the validator', function () {
      it('once', function () {
        assert(validator.calledOnce);
      });
      it('with req as the only argument', function () {
        assert(validator.calledWithExactly(req));
      });
    });
    it('should relay the promise returned by db.index()', function () {
      promise.then(res => assert.strictEqual(res, dbIndexResult));
    });
  });

  describe('When validator returns with an instance of ValidationError', function () {
    it('should reject with the ValidationError returned from validator', function () {
      const validationError = new ValidationError();
      validator = stub().returns(validationError);
      return create(req, db, validator, ValidationError)
        .catch(err => assert.strictEqual(err, validationError));
    });
  });
});
