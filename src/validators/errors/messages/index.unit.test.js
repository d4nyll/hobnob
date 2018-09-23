import assert from 'assert';
import generateValidationErrorMessage from '.';

describe('generateValidationErrorMessage', function () {
  it('should return the correct string when error.keyword is "required"', function () {
    const errors = [{
      keyword: 'required',
      dataPath: '.test.path',
      params: {
        missingProperty: 'property',
      },
    }];
    const actualErrorMessage = generateValidationErrorMessage(errors);
    const expectedErrorMessage = "The '.test.path.property' field is missing";
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
  it('should return the correct string when error.keyword is "type"', function () {
    const errors = [{
      keyword: 'type',
      dataPath: '.test.path',
      params: {
        type: 'string',
      },
    }];
    const actualErrorMessage = generateValidationErrorMessage(errors);
    const expectedErrorMessage = "The '.test.path' field must be of type string";
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
  it('should return the correct string when error.keyword is "pattern"', function () {
    const errors = [{
      keyword: 'pattern',
      dataPath: '.test.path',
    }];
    const actualErrorMessage = generateValidationErrorMessage(errors);
    const expectedErrorMessage = "The '.test.path' field should be a valid bcrypt digest";
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
  it('should return the correct string when error.keyword is "format"', function () {
    const errors = [{
      keyword: 'format',
      dataPath: '.test.path',
      params: {
        format: 'email',
      },
    }];
    const actualErrorMessage = generateValidationErrorMessage(errors);
    const expectedErrorMessage = "The '.test.path' field must be a valid email";
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
  it('should return the correct string when error.keyword is "additionalProperties"', function () {
    const errors = [{
      keyword: 'additionalProperties',
      dataPath: '.test.path',
      params: {
        additionalProperty: 'email',
      },
    }];
    const actualErrorMessage = generateValidationErrorMessage(errors);
    const expectedErrorMessage = "The '.test.path' object does not support the field 'email'";
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
  it('should return the correct string when error.keyword is not recognized', function () {
    const errors = [{
      keyword: 'foobar',
    }];
    const actualErrorMessage = generateValidationErrorMessage(errors);
    const expectedErrorMessage = 'The object is not valid';
    assert.equal(actualErrorMessage, expectedErrorMessage);
  });
});
