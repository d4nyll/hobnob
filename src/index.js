import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import elasticsearch from 'elasticsearch';

import checkEmptyPayload from './middlewares/check-empty-payload';
import checkContentTypeIsSet from './middlewares/check-content-type-is-set';
import checkContentTypeIsJson from './middlewares/check-content-type-is-json';
import errorHandler from './middlewares/error-handler';

import ValidationError from './validators/errors/validation-error';
import createUserValidator from './validators/users/create';
import injectHandlerDependencies from './utils/inject-handler-dependencies';

// Handlers
import createUserHandler from './handlers/users/create';
import retrieveUserHandler from './handlers/users/retrieve';
import deleteUserHandler from './handlers/users/delete';

// Engines
import createUserEngine from './engines/users/create';
import retrieveUserEngine from './engines/users/retrieve';
import deleteUserEngine from './engines/users/delete';

const handlerToEngineMap = new Map([
  [createUserHandler, createUserEngine],
  [retrieveUserHandler, retrieveUserEngine],
  [deleteUserHandler, deleteUserEngine],
]);

const handlerToValidatorMap = new Map([
  [createUserHandler, createUserValidator],
]);

const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});
const app = express();

app.use(checkEmptyPayload);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJson);
app.use(bodyParser.json({ limit: 1e6 }));

app.post('/users', injectHandlerDependencies(createUserHandler, client, handlerToEngineMap, handlerToValidatorMap, ValidationError));
app.get('/users/:userId', injectHandlerDependencies(retrieveUserHandler, client, handlerToEngineMap, handlerToValidatorMap, ValidationError));
app.delete('/users/:userId', injectHandlerDependencies(deleteUserHandler, client, handlerToEngineMap, handlerToValidatorMap, ValidationError));

app.use(errorHandler);

app.listen(process.env.SERVER_PORT, async () => {
  const indexParams = { index: process.env.ELASTICSEARCH_INDEX };
  const indexExists = await client.indices.exists(indexParams);
  if (!indexExists) {
    await client.indices.create(indexParams);
  }
  // eslint-disable-next-line no-console
  console.log(`Hobnob API server listening on port ${process.env.SERVER_PORT}!`);
});
