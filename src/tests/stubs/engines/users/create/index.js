import { stub } from 'sinon';
import ValidationError from '../../../../../validators/errors/validation-error';

const CREATE_USER_RESPONSE = 'NEW_USER_ID';
const VALIDATION_ERROR_MESSAGE = 'VALIDATION_ERROR_MESSAGE';
const GENERIC_ERROR_MESSAGE = 'Internal Server Error';
const generate = () => ({
  success: stub().resolves(CREATE_USER_RESPONSE),
  validationError: stub().rejects(new ValidationError(VALIDATION_ERROR_MESSAGE)),
  genericError: stub().rejects(new Error(GENERIC_ERROR_MESSAGE)),
});

export {
  generate as default,
  VALIDATION_ERROR_MESSAGE,
  GENERIC_ERROR_MESSAGE,
  CREATE_USER_RESPONSE,
};
