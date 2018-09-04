#!/usr/bin/env bash

# Make sure the port is not already bound
if ss -lnt | grep -q :$SERVER_PORT; then
  echo "Another process is already listening to port $SERVER_PORT"
  exit 1;
fi

RETRY_INTERVAL=${RETRY_INTERVAL:-0.2}

if ! systemctl is-active --quiet elasticsearch.service; then
  sudo systemctl start elasticsearch.service
  # Wait until Elasticsearch is ready to respond
  until curl --silent $ELASTICSEARCH_HOSTNAME:$ELASTICSEARCH_PORT -w "" -o /dev/null; do
    sleep $RETRY_INTERVAL
  done
fi

# Run our API server as a background process
yarn run serve &

until ss -lnt | grep -q :$SERVER_PORT; do
  sleep $RETRY_INTERVAL
done

npx cucumber-js spec/cucumber/features --require-module @babel/register --require spec/cucumber/steps

kill -15 0