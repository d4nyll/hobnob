import assert from 'assert';
import ValidationError from '../../../validators/errors/validation-error';
import generatevalidator, { VALIDATION_ERROR } from '../../../tests/stubs/validate';
import generateESClientUpdateStub from '../../../tests/stubs/elasticsearch/client/update';
import replace from '.';

const USER_ID = 'USER_ID';

describe('Engine - Profile - Replace', function () {
  let req;
  let db;
  let validator;
  let promise;
  beforeEach(function () {
    req = {
      body: {},
      params: {
        userId: USER_ID,
      },
      user: {
        id: USER_ID,
      },
    };
    db = { update: generateESClientUpdateStub.success() };
  });
  describe('When invoked', function () {
    beforeEach(function () {
      validator = generatevalidator().valid;
      return replace(req, db, validator, ValidationError);
    });
    describe('should call the validator', function () {
      it('once', function () {
        assert(validator.calledOnce);
      });
      it('with req as the only argument', function () {
        assert(validator.calledWithExactly(req));
      });
    });
  });
  describe('When the validate function returns false', function () {
    beforeEach(function () {
      validator = generatevalidator().invalid;
      promise = replace(req, db, validator, ValidationError);
    });
    it('should return with a promise that rejects with a ValidationError', function () {
      return promise.catch(error => assert(error, VALIDATION_ERROR));
    });
  });
  describe('When the validate function returns true', function () {
    beforeEach(function () {
      validator = generatevalidator().valid;
    });
    describe('Continues execution', function () {
      beforeEach(function () {
        promise = replace(req, db, validator, ValidationError);
        return promise;
      });
      describe('should call client.update()', function () {
        const expectedArgument = {
          index: process.env.ELASTICSEARCH_INDEX,
          type: 'user',
          id: USER_ID,
          body: {
            script: {
              lang: 'painless',
              params: {
                profile: {},
              },
              source: 'ctx._source.profile = params.profile',
            },
          },
        };
        it('once', function () {
          assert(db.update.calledOnce);
        });
        it('with the correct argument', function () {
          assert.deepEqual(db.update.getCall(0).args[0], expectedArgument);
        });
      });
    });
    describe('When the client.update() operation is successful', function () {
      beforeEach(function () {
        db = { update: generateESClientUpdateStub.success() };
        promise = replace(req, db, validator, ValidationError);
        return promise;
      });
      it('should return with a promise that resolves to undefined', function () {
        return promise.then(result => assert(typeof result === 'undefined'));
      });
    });
    describe('When the user does not exists', function () {
      beforeEach(function () {
        db = { update: generateESClientUpdateStub.notFound() };
        promise = replace(req, db, validator, ValidationError);
      });
      describe('should return with a promise that rejects', function () {
        it('with an Error object', function () {
          return promise.catch(error => assert(error instanceof Error));
        });
        it("that has the mesage 'Not Found'", function () {
          return promise.catch(error => assert.equal(error.message, 'Not Found'));
        });
      });
    });
    describe('When the client.update operation is otherwise unsuccessful', function () {
      beforeEach(function () {
        db = { update: generateESClientUpdateStub.failure() };
        promise = replace(req, db, validator, ValidationError);
      });
      describe('should return with a promise that rejects', function () {
        it('with an Error object', function () {
          return promise.catch(error => assert(error instanceof Error));
        });
        it("that has the mesage 'Internal Server Error'", function () {
          return promise.catch(error => assert.equal(error.message, 'Internal Server Error'));
        });
      });
    });
  });
});
