#!/usr/bin/env bash

# Make sure the port is not already bound
if ss -lnt | grep -q :$SERVER_PORT; then
  echo "Another process is already listening to port $SERVER_PORT"
  exit 1;
fi

RETRY_INTERVAL=${RETRY_INTERVAL:-0.2}

if ! systemctl is-active --quiet elasticsearch; then
  sudo systemctl start elasticsearch
  # Wait until Elasticsearch is ready to respond
  until curl --silent $ELASTICSEARCH_HOSTNAME:$ELASTICSEARCH_PORT -w "" -o /dev/null; do
    sleep $RETRY_INTERVAL
  done
fi

# Clean the test index (if it exists)
curl --silent -o /dev/null -X DELETE "$ELASTICSEARCH_HOSTNAME:$ELASTICSEARCH_PORT/$ELASTICSEARCH_INDEX"
