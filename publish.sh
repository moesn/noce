#! /usr/bin/bash

cd projects
npm version patch
cd ..
npm run build
cd dist
rm -rf esm2015
npm publish
