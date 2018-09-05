import ValidationError from '../errors/validation-error';

function validate(req) {
  if (
    !Object.prototype.hasOwnProperty.call(req.body, 'email')
    || !Object.prototype.hasOwnProperty.call(req.body, 'password')
  ) {
    return new ValidationError('Payload must contain at least the email and password fields');
  }
  if (
    typeof req.body.email !== 'string'
    || typeof req.body.password !== 'string'
  ) {
    return new ValidationError('The email and password fields must be of type string');
  }
  if (!/^[\w.+]+@\w+\.\w+$/.test(req.body.email)) {
    return new ValidationError('The email field must be a valid email.');
  }
  return undefined;
}

export default validate;
