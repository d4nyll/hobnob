import assert from 'assert';
import { spy, stub } from 'sinon';
import ValidationError from '../../../validators/errors/validation-error';
import createUser from '.';

const VALIDATION_ERROR_MESSAGE = 'VALIDATION_ERROR_MESSAGE';
const USER_ID = 'USER_ID';

const generateCreateStubs = {
  success: () => stub().resolves({ _id: USER_ID }),
  genericError: () => stub().rejects(new Error()),
  validationError: () => stub().rejects(new ValidationError(VALIDATION_ERROR_MESSAGE)),
};

function generateResMock() {
  return {
    status: spy(),
    set: spy(),
    json: spy(),
    send: spy(),
  };
}

describe('createUser', function () {
  const db = {};
  const req = {};

  let res;
  let create;
  let validator;

  beforeEach(function () {
    res = generateResMock();
  });
  describe('When invoked', function () {
    beforeEach(function () {
      create = generateCreateStubs.success();
      validator = {};
      return createUser(req, res, db, create, validator, ValidationError);
    });
    describe('should call the create engine function', function () {
      it('once', function () {
        assert(create.calledOnce);
      });
      it('with req, db', function () {
        assert(create.calledWithExactly(req, db, validator, ValidationError));
      });
    });
  });
  describe("When create resolves with the new user's ID", function () {
    beforeEach(function () {
      create = generateCreateStubs.success();
      return createUser(req, res, db, create, validator, ValidationError);
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
        assert(res.send.calledWithExactly(USER_ID));
      });
    });
  });
  describe('When create rejects with an instance of ValidationError', function () {
    beforeEach(function () {
      create = generateCreateStubs.validationError();
      return createUser(req, res, db, create, validator, ValidationError);
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
      create = generateCreateStubs.genericError();
      return createUser(req, res, db, create, validator, ValidationError);
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
