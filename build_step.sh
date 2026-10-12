#!/bin/bash

echo "Install dependencies"
npm install
npm install --prefix client
npm install --prefix server

echo "Run npm build"
npm run build
