import assert from 'assert';
import superagent from 'superagent';
import { When, Then } from 'cucumber';

When(/^the client creates a (GET|POST|PATCH|PUT|DELETE|OPTIONS|HEAD) request to ([/\w-:.]+)$/, function (method, path) {
  this.request = superagent(method, `${process.env.SERVER_HOSTNAME}:${process.env.SERVER_PORT}${path}`);
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

When(/^sends the request$/, function (callback) {
  this.request
    .then((response) => {
      this.response = response.res;
      callback();
    })
    .catch((error) => {
      this.response = error.response;
      callback();
    });
});

Then(/^our API should respond with a ([1-5]\d{2}) HTTP status code$/, function (statusCode) {
  assert.equal(this.response.statusCode, statusCode);
});

Then(/^the payload of the response should be a JSON object$/, function () {
  // Check Content-Type header
  const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Response not of Content-Type application/json');
  }

  // Check it is valid JSON
  try {
    this.responsePayload = JSON.parse(this.response.text);
  } catch (e) {
    throw new Error('Response not a valid JSON object');
  }
});

Then(/^contains a message property which says (?:"|')(.*)(?:"|')$/, function (message) {
  assert.equal(this.responsePayload.message, message);
});

When(/^without a (?:"|')([\w-]+)(?:"|') header set$/, function (headerName) {
  this.request.unset(headerName);
});

When(/^attaches an? (.+) payload which is missing the ([a-zA-Z0-9, ]+) fields?$/, function (payloadType, missingFields) {
  const payload = {
    email: 'e@ma.il',
    password: 'password',
  };
  const fieldsToDelete = missingFields.split(',').map(s => s.trim()).filter(s => s !== '');
  fieldsToDelete.forEach(field => delete payload[field]);
  this.request
    .send(JSON.stringify(payload))
    .set('Content-Type', 'application/json');
});

When(/^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are)(\s+not)? a ([a-zA-Z]+)$/, function (payloadType, fields, invert, type) {
  const payload = {
    email: 'e@ma.il',
    password: 'password',
  };
  const typeKey = type.toLowerCase();
  const invertKey = invert ? 'not' : 'is';
  const sampleValues = {
    string: {
      is: 'string',
      not: 10,
    },
  };
  const fieldsToModify = fields.split(',').map(s => s.trim()).filter(s => s !== '');
  fieldsToModify.forEach((field) => {
    payload[field] = sampleValues[typeKey][invertKey];
  });
  this.request
    .send(JSON.stringify(payload))
    .set('Content-Type', 'application/json');
});

When(/^attaches an? (.+) payload where the ([a-zA-Z0-9, ]+) fields? (?:is|are) exactly (.+)$/, function (payloadType, fields, value) {
  const payload = {
    email: 'e@ma.il',
    password: 'password',
  };
  const fieldsToModify = fields.split(',').map(s => s.trim()).filter(s => s !== '');
  fieldsToModify.forEach((field) => {
    payload[field] = value;
  });
  this.request
    .send(JSON.stringify(payload))
    .set('Content-Type', 'application/json');
});
