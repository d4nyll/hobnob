#!/usr/bin/env bash

yarn run docs:update
http-server docs/dist/ -p $SWAGGER_UI_PORT
