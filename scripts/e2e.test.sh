#!/usr/bin/env bash

RETRY_INTERVAL=${RETRY_INTERVAL:-0.2}

# Run our API server as a background process
yarn run test:serve &

until ss -lnt | grep -q :$SERVER_PORT; do
  sleep $RETRY_INTERVAL
done

npx cucumber-js spec/cucumber/features --require-module @babel/register --require spec/cucumber/steps

if [[ -z $TRAVIS_COMMIT && -z $JENKINS ]]; then
  kill -15 0
fi

exit 0
