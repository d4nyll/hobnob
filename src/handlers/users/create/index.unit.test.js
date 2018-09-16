import assert from 'assert';
import generateResSpy from '../../../tests/spies/res';
import generateCreateStubs, { CREATE_USER_RESPONSE } from '../../../tests/stubs/engines/users/create';
import ValidationError from '../../../validators/errors/validation-error';
import create from '.';

const VALIDATION_ERROR_MESSAGE = 'VALIDATION_ERROR_MESSAGE';

describe('createUser', function () {
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
      engine = generateCreateStubs().success;
      validator = {};
      return create(req, res, db, engine, validator, ValidationError);
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
  describe("When create resolves with the new user's ID", function () {
    beforeEach(function () {
      engine = generateCreateStubs().success;
      return create(req, res, db, engine, validator, ValidationError);
    });
    describe('should call res.status()', function () {
      it('once', function () {
        assert(res.status.calledOnce);
      });
      it('with the argument 201', function () {
        assert(res.status.calledWithExactly(201));
      });
    });

    describe('should call res.set()', function () {
      it('once', function () {
        assert(res.set.calledOnce);
      });
      it('with the arguments "Content-Type" and "text/plain"', function () {
        assert(res.set.calledWithExactly('Content-Type', 'text/plain'));
      });
    });

    describe('should call res.send()', function () {
      it('once', function () {
        assert(res.send.calledOnce);
      });
      it("with the new user's ID", function () {
        assert(res.send.calledWithExactly(CREATE_USER_RESPONSE));
      });
    });
  });
  describe('When create rejects with an instance of ValidationError', function () {
    beforeEach(function () {
      engine = generateCreateStubs().validationError;
      return create(req, res, db, engine, validator, ValidationError);
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
      engine = generateCreateStubs().genericError;
      return create(req, res, db, engine, validator, ValidationError);
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
