import assert from 'assert';
import { stub } from 'sinon';
import ValidationError from '../../../validators/errors/validation-error';
import generateESClientIndexStub, { INDEX_RESOLVE_ID } from '../../../tests/stubs/elasticsearch/client/index';

import create from '.';

describe('Engine - User - Create', function () {
  let req;
  let db;
  let validator;
  beforeEach(function () {
    req = {};
    db = {
      index: generateESClientIndexStub.success(),
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
    it('should resolve with the _id property extracted from the result of db.index()', function () {
      return promise.then(res => assert.strictEqual(res, INDEX_RESOLVE_ID));
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
