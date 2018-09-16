import { stub } from 'sinon';

const INDEX_RESOLVE_ID = 'INDEX_RESOLVE_ID';
const INDEX_RESOLVE_OBJ = {
  result: 'created',
  _id: INDEX_RESOLVE_ID,
};

const INDEX_REJECT_ERROR = new Error();

const generate = {
  success() {
    return stub().returns(Promise.resolve(INDEX_RESOLVE_OBJ));
  },
  failure() {
    return stub().returns(Promise.reject(INDEX_REJECT_ERROR));
  },
};

export {
  generate as default,
  INDEX_RESOLVE_ID,
  INDEX_RESOLVE_OBJ,
};
