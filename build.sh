#!/bin/bash

rm -rf ./mongoosereadbook_1.0.0.tar.gz
docker rmi mongoosereadbook:1.0.0

docker build --pull --rm -f "Dockerfile" -t mongoosereadbook:1.0.0 "."

docker save mongoosereadbook:1.0.0 | gzip > mongoosereadbook_1.0.0.tar.gz
