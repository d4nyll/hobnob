#!/usr/bin/env bash

sed -i "s!https://petstore.swagger.io/v2/swagger.json!$SERVER_EXTERNAL_PROTOCOL://$SERVER_EXTERNAL_HOSTNAME:$SERVER_EXTERNAL_PORT/openapi.yaml!g" docs/dist/index.html
sed -i '/<\/head>/i<style>.topbar { display: none; }<\/style>' docs/dist/index.html
