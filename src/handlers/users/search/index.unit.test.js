import assert from 'assert';
import generateResSpy from '../../../tests/spies/res';
import generateSearchStubs, { SEARCH_USER_RESPONSE_OBJECT, VALIDATION_ERROR_MESSAGE } from '../../../tests/stubs/engines/users/search';
import ValidationError from '../../../validators/errors/validation-error';
import search from '.';

describe('Handler - Users - Search', function () {
  const db = {};
  const req = {};

  let res;
  let engine;
  let validator;

  beforeEach(function () {
    res = generateResSpy();
  });
  describe('When invoked', function () {
    beforeEach(function () {
      engine = generateSearchStubs().success;
      validator = {};
      return search(req, res, db, engine, validator, ValidationError);
    });
    describe('should call the create engine function', function () {
      it('once', function () {
        assert(engine.calledOnce);
      });
      it('with req, db', function () {
        assert(engine.calledWithExactly(req, db, validator, ValidationError));
      });
    });
  });
  describe('When create resolves with the search results', function () {
    beforeEach(function () {
      engine = generateSearchStubs().success;
      return search(req, res, db, engine, validator, ValidationError);
    });
    describe('should call res.status()', function () {
      it('once', function () {
        assert(res.status.calledOnce);
      });
      it('with the argument 200', function () {
        assert(res.status.calledWithExactly(200));
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

    describe('should call res.send()', function () {
      it('once', function () {
        assert(res.json.calledOnce);
      });
      it('with the search results', function () {
        assert(res.json.calledWithExactly(SEARCH_USER_RESPONSE_OBJECT));
      });
    });
  });
  describe('When create rejects with an instance of ValidationError', function () {
    beforeEach(function () {
      engine = generateSearchStubs().validationError;
      return search(req, res, db, engine, validator, ValidationError);
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
        assert(res.json.calledWithExactly({ message: VALIDATION_ERROR_MESSAGE }));
      });
    });
  });
  describe('When create rejects with an instance of Error', function () {
    beforeEach(function () {
      engine = generateSearchStubs().genericError;
      return search(req, res, db, engine, validator, ValidationError);
    });
    describe('should call res.status()', function () {
      it('once', function () {
        assert(res.status.calledOnce);
      });
      it('with the argument 500', function () {
        assert(res.status.calledWithExactly(500));
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
        assert(res.json.calledWithExactly({ message: 'Internal Server Error' }));
      });
    });
  });
});
