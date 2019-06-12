# Demo Calling Amazon SQS from a Skill

## Prerequisites
* Amazon Developer Account
* AWS Account

## Dependencies
* Code runs in AWS Lambda - if run elsewhere, must include the AWS SDK.

## Setup
1. Load this [aws-demo-amazon-sqs.yaml](./aws-demo-amazon-sqs.yaml) template into your AWS account using [CloudFormation](https://console.aws.amazon.com/cloudformation).
> This template creates the IAM role used by the Lambda function created by the ASK CLI. It will not update the IAM role if it is first created by the ASK CLI. 
1. Use the ASK CLI to deploy the skill.

## Running the Demo

To run the demo, simply launch the skill, "Alexa, open s. q. s. demo".  This will place a new entry in the queue and tell you about any previous entries in the queue.

To view the queue, locate the queue in the [Amazon SQS console](https://console.aws.amazon.com/sqs).

## Resources

[Amazon SQS Developer Guide](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html)

[Amazon SQS API Reference](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/)
