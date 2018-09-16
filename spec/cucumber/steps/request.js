import superagent from 'superagent';
import { When } from 'cucumber';
import objectPath from 'object-path';
import { processPath, getValidPayload, convertStringToArray } from './utils';

When(/^the client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to ([/\w-:.]+)$/, function (method, path) {
  const processedPath = processPath(this, path);
  this.request = superagent(method, `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}${processedPath}`);
});

When(/^attaches a generic (.+) payload$/, function (payloadType) {
  switch (payloadType) {
    case 'malformed':
      this.request
        .send('{"email": "dan@danyll.com", name: }')
        .set('Content-Type', 'application/json');
      break;
    case 'non-JSON':
      this.request
        .send('<?xml version="1.0" encoding="UTF-8" ?><email>dan@danyll.com</email>')
        .set('Content-Type', 'text/xml');
      break;
    case 'empty':
    default:
  }
});

When(/^attaches a valid (.+) payload$/, function (payloadType) {
  this.requestPayload = getValidPayload(payloadType, this);
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^attaches an? (.+) payload which is missing the ([a-zA-Z0-9, ]+) fields?$/, function (payloadType, missingFields) {
  this.requestPayload = getValidPayload(payloadType, this);
  const fieldsToDelete = convertStringToArray(missingFields);
  fieldsToDelete.forEach(field => delete this.requestPayload[field]);
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^attaches an? (.+) payload where the ([a-zA-Z0-9., ]+) fields? (?:is|are)(\s+not)? a ([a-zA-Z]+)$/, function (payloadType, fields, invert, type) {
  this.requestPayload = getValidPayload(payloadType, this);
  const typeKey = type.toLowerCase();
  const invertKey = invert ? 'not' : 'is';
  const sampleValues = {
    object: {
      is: {},
      not: 'string',
    },
    string: {
      is: 'string',
      not: 10,
    },
  };
  const fieldsToModify = convertStringToArray(fields);
  fieldsToModify.forEach((field) => {
    objectPath.set(this.requestPayload, field, sampleValues[typeKey][invertKey]);
  });
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are) exactly (.+)$/, function (payloadType, fields, value) {
  this.requestPayload = getValidPayload(payloadType, this);
  const fieldsToModify = convertStringToArray(fields);
  fieldsToModify.forEach((field) => {
    this.requestPayload[field] = value;
  });
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^attaches an? (.+) payload which has the additional ([a-zA-Z0-9, ]+) fields?$/, function (payloadType, additionalFields) {
  this.requestPayload = getValidPayload(payloadType, this);
  const fieldsToAdd = convertStringToArray(additionalFields);
  fieldsToAdd.forEach(field => objectPath.set(this.requestPayload, field, 'foo'));
  this.request
    .send(JSON.stringify(this.requestPayload))
    .set('Content-Type', 'application/json');
});

When(/^attaches (.+) as the payload$/, function (payload) {
  this.requestPayload = JSON.parse(payload);
  this.request
    .send(payload)
    .set('Content-Type', 'application/json');
});

When(/^without a (?:"|')([\w-]+)(?:"|') header set$/, function (headerName) {
  this.request.unset(headerName);
});

When(/^set (?:"|')(.+)(?:"|') as a query parameter$/, function (queryString) {
  return this.request
    .query(queryString);
});

When(/^sends the request$/, function () {
  return this.request
    .then((response) => {
      this.response = response.res;
    })
    .catch((error) => {
      this.response = error.response;
    });
});
