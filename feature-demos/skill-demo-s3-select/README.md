# Query an S3 bucket using SQL from an Alexa Skill
This is a basic AWS S3 Select example to fetch data from a JSON file with space facts using a subset of SQL.
With S3 Select, you simply store your data on S3 and query using SQL statements to filter the contents of S3 objects, retrieving only the data that you need. By retrieving only a subset of the data, customers reduce the amount of data that Amazon S3 transfers, which reduces the cost and latency of retrieving this data.

For more info check out our blog post: [Query Amazon S3 Like a Relational Database to Provide Fresh Skill Content](https://developer.amazon.com/en-US/blogs/alexa/alexa-skills-kit/2019/10/query-amazon-s3-like-a-relational-database-to-provide-fresh-skill-content)

# License

This library is licensed under the Amazon Software License.

# Setup Instructions

1. `ask deploy` (or copy all files to Alexa Hosted Skill)
2. Modify AWS Lambda Role to give read only access to S3 (if not an Alexa Hosted Skill)

## Prerequisites

1. You will need an [AWS Developer Account](https://aws.amazon.com/free/) (if not an Alexa Hosted Skill)
2. You will need an [Amazon Developer Account for the Alexa portion](https://developer.amazon.com/).

## Setup

Upload file `facts.json` to S3.
- For your own S3 bucket: upload the file `facts.json` (available in the root of this project) to your bucket and replace the name of the bucket in file `lambda/index.js` (`s3Bucket` constant)
- For an Alexa Hosted Skill S3 bucket: go to the `Code` tab of your skill (developer console), click on `Media storage: S3` link (bottom left), go up to root directory (not `Media`) and upload the file `facts.json` (available in the root of this project). No need to modify the bucket name in `lambda/index.js`