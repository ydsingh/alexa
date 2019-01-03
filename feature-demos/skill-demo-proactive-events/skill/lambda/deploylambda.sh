#!/usr/bin/env bash

rm index.zip

cd custom

rm -rf node_modules/aws-sdk

zip  ../index.zip * –X -r
# read -n1 -r -p "Zip complete, press space to deploy..." key

cd ..
aws lambda update-function-code --function-name ask-custom-PingMe --zip-file fileb://index.zip
cd ..

