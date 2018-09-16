import assert from 'assert';
import { When, Then } from 'cucumber';
import elasticsearch from 'elasticsearch';
import objectPath from 'object-path';

const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});

When(/^saves the response text in the context under ([\w.]+)$/, function (contextPath) {
  objectPath.set(this, contextPath, this.response.text);
});

Then(/^our API should respond with a ([1-5]\d{2}) HTTP status code$/, function (statusCode) {
  assert.equal(this.response.statusCode, statusCode);
});

Then(/^the payload of the response should be an? ([a-zA-Z0-9, ]+)$/, function (payloadType) {
  const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type'];
  if (payloadType === 'JSON object'
      || payloadType === 'array'
  ) {
    // Check Content-Type header
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response not of Content-Type application/json');
    }

    // Check it is valid JSON
    try {
      this.responsePayload = JSON.parse(this.response.text);
    } catch (e) {
      throw new Error('Response not a valid JSON object');
    }
  } else if (payloadType === 'string') {
    // Check Content-Type header
    if (!contentType || !contentType.includes('text/plain')) {
      throw new Error('Response not of Content-Type text/plain');
    }

    // Check it is a string
    this.responsePayload = this.response.text;
    if (typeof this.responsePayload !== 'string') {
      throw new Error('Response not a string');
    }
  }
});

Then(/^contains a message property which says (?:"|')(.*)(?:"|')$/, function (message) {
  assert.equal(this.responsePayload.message, message);
});

Then(/^the payload object should be added to the database, grouped under the "([a-zA-Z]+)" type$/, function (type) {
  this.type = type;
  return client.get({
    index: process.env.ELASTICSEARCH_INDEX,
    type,
    id: this.responsePayload,
  }).then((result) => {
    assert.deepEqual(result._source, this.requestPayload);
  });
});

Then(/^the ([\w.]+) property of the response should be the same as context\.([\w.]+)$/, function (responseProperty, contextProperty) {
  assert.deepEqual(objectPath.get(this.responsePayload, (responseProperty === 'root' ? '' : responseProperty)), objectPath.get(this, contextProperty));
});

Then(/^the ([\w.]+) property of the response should be an? ([\w.]+) with the value (.+)$/, function (responseProperty, expectedResponseType, expectedResponse) {
  const parsedExpectedResponse = (function () {
    switch (expectedResponseType) {
      case 'object':
        return JSON.parse(expectedResponse);
      case 'string':
        return expectedResponse.replace(/^(?:["'])(.*)(?:["'])$/, '$1');
      default:
        return expectedResponse;
    }
  }());
  assert.deepEqual(objectPath.get(this.responsePayload, (responseProperty === 'root' ? '' : responseProperty)), parsedExpectedResponse);
});

Then(/^the first item of the response should have property ([\w.]+) set to (.+)$/, function (path, value) {
  assert.equal(objectPath.get(this.responsePayload[0], path), value);
});

Then(/^the response should contain (\d+) items$/, function (count) {
  assert.equal(this.responsePayload.length, count);
});
