#! /usr/bin/bash

cd projects
npm version patch
cd ..
npm run build
cd dist
npm publish
