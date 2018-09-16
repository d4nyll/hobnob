import assert from 'assert';
import { Given, Then } from 'cucumber';
import elasticsearch from 'elasticsearch';
import objectPath from 'object-path';

const client = new elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});

Given(/^all documents of type (?:"|')([\w-]+)(?:"|') are deleted$/, function (type) {
  return client.deleteByQuery({
    index: process.env.ELASTICSEARCH_INDEX,
    type,
    body: {
      query: {
        match_all: {},
      },
    },
    conflicts: 'proceed',
    refresh: true,
  });
});

Then(/^the entity of type (\w+), with ID stored under ([\w.]+), should be deleted$/, function (type, idPath) {
  return client.delete({
    index: process.env.ELASTICSEARCH_INDEX,
    type,
    id: objectPath.get(this, idPath),
    refresh: 'true',
  }).then((res) => {
    assert.equal(res.result, 'deleted');
  });
});
