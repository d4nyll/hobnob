import { stub } from 'sinon';
import NotFoundError from '../../errors/not-found';

const DELETE_RESOLVE_OBJ = undefined;
const DELETE_REJECT_NOT_FOUND_ERROR = new NotFoundError('Not Found');
const DELETE_REJECT_ERROR = new Error();

const generate = {
  success() {
    return stub().returns(Promise.resolve(DELETE_RESOLVE_OBJ));
  },
  notFound() {
    return stub().returns(Promise.reject(DELETE_REJECT_NOT_FOUND_ERROR));
  },
  failure() {
    return stub().returns(Promise.reject(DELETE_REJECT_ERROR));
  },
};

export {
  generate as default,
};
