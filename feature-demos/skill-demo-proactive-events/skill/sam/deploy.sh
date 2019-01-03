#!/usr/bin/env bash

PROJECT_NAME="PingMe"

#    PACKAGE_BUCKET="alexabucket234"
#    # your unique bucket for publishing a new packaged SAM
#
    cd ../lambda
#   rm index.zip
    cd custom
    npm install
    rm -rf node_modules/aws-sdk # unnecessary within Lambda, smaller size enables code editor

#    zip  ../index.zip * –X -r
#    cd ..
#    # aws lambda update-function-code --function-name MyFunction --zip-file fileb://index.zip
#    cd ../sam

# aws cloudformation package --template-file ./pingme.yaml --s3-bucket $PACKAGE_BUCKET --output-template-file ./packaged-pingme.yaml

aws cloudformation deploy --template-file ./packaged-pingme.yaml --stack-name $PROJECT_NAME --parameter-overrides ProjectName=$PROJECT_NAME  --capabilities CAPABILITY_IAM

