import assert from 'assert';
import { match } from 'sinon';
import generateResSpy from '../../../tests/spies/res';
import generateReplaceProfileStubs, { VALIDATION_ERROR_MESSAGE as REPLACE_PROFILE_VALIDATION_ERROR_MESSAGE } from '../../../tests/stubs/engines/profile/replace';
import ValidationError from '../../../validators/errors/validation-error';
import replace from '.';

describe('Handler - Profile - Replace', function () {
  const db = {};
  const req = {};

  let res;
  let engine;
  let validator;
  beforeEach(function () {
    res = generateResSpy();
  });

  describe('When called with valid request object', function () {
    beforeEach(function () {
      engine = generateReplaceProfileStubs().success;
      return replace(req, res, db, engine, validator, ValidationError);
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
    describe('should call res.send()', function () {
      it('once', function () {
        assert(res.send.calledOnce);
      });
      it('with no arguments', function () {
        assert(res.send.calledWithExactly());
      });
    });
  });
  describe('When called with an invalid request object', function () {
    beforeEach(function () {
      engine = generateReplaceProfileStubs().validationError;
      return replace(req, res, db, engine, validator, ValidationError);
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
      it('with a validation error object', function () {
        assert(res.json.calledWithExactly(match.has('message', REPLACE_PROFILE_VALIDATION_ERROR_MESSAGE)));
      });
    });
  });

  describe('When replaceProfile throws a User Not Found error', function () {
    beforeEach(function () {
      engine = generateReplaceProfileStubs().notFoundError;
      return replace(req, res, db, engine, validator, ValidationError);
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
  describe('When replaceProfile throws an unexpected error', function () {
    beforeEach(function () {
      engine = generateReplaceProfileStubs().genericError;
      return replace(req, res, db, engine, validator, ValidationError);
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
