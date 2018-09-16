import { stub } from 'sinon';
import ValidationError from '../../../../../validators/errors/validation-error';

const SEARCH_USER_RESPONSE_OBJECT = [{
  email: 'e@ma.il',
  profile: {
    name: {
      first: 'first',
      last: 'last',
      middle: 'middle',
    },
    summary: 'Sample Summary 1',
    bio: 'Sample Bio 1',
  },
}, {
  email: 'foo@bar.baz',
  profile: {
    summary: 'Sample Summary 2',
    bio: 'Sample Bio 2',
  },
}];
const VALIDATION_ERROR_MESSAGE = 'VALIDATION_ERROR_MESSAGE';
const GENERIC_ERROR_MESSAGE = 'Internal Server Error';
const generate = () => ({
  success: stub().resolves(SEARCH_USER_RESPONSE_OBJECT),
  validationError: stub().rejects(new ValidationError(VALIDATION_ERROR_MESSAGE)),
  genericError: stub().rejects(new Error(GENERIC_ERROR_MESSAGE)),
});

export {
  generate as default,
  SEARCH_USER_RESPONSE_OBJECT,
  VALIDATION_ERROR_MESSAGE,
  GENERIC_ERROR_MESSAGE,
};
