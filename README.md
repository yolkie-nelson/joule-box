<center>
 <img src ="images/joule-box-logo.png">
</center>

## Overview

The Joule Box Green Energy Dashboard is a web-based application designed to monitor and manage the efficiency of battery storage for renewable energy. The dashboard displays real-time data on battery charge levels, energy output, and financial metrics related to energy sold back to the grid.

## Features

- Battery Inventory Management
- Real-Time Data Processing
- User Authentication and Management
- Data Visualization and Reports
- Notifications and Alerts
- Data Storage and Backup
- Performance and Optimization
- Serverless Architecture

## Tech Stack

- **Backend**: Node.js, Express, AWS Lambda, AWS API Gateway, AWS SSM, PostgreSQL, MongoDB, DynamoDB, Redshift
- **Frontend**: React, TypeScript
- **Infrastructure**: Docker, AWS S3, AWS CloudFront, AWS CloudWatch

## Prerequisites

- Node.js (version 14.x or later)
- Docker
- AWS CLI configured with necessary permissions
- Serverless Framework

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd joule-box
```

### 2. Set Up Environment Variables

```
PORT=8000
REDSHIFT_URL=your_redshift_connection_string
DATABASE_URL=your_postgres_database_url
MONGO_URI=your_mongo_uri
DYNAMODB_ENDPOINT=your_dynamodb_endpoint
COGNITO_USER_POOL_ID=your_cognito_user_pool_id
COGNITO_CLIENT_ID=your_cognito_client_id
KINESIS_FIREHOSE=your_kinesis_firehose
S3_BUCKET=joulebox-data
```

### 3. Install Dependencies

#### Backend
```
cd api
npm install
```

#### Frontend
```
cd ../src
npm install
```

### 4. Set Up AWS Services

1. S3 Bucket
Ensure you have an S3 bucket created and named joulebox-data.

2. Redshift
Create a Redshift Serverless endpoint.
Obtain the connection string and update the .env file with REDSHIFT_URL.
3. Kinesis Firehose
Create a Kinesis Firehose delivery stream.
Update the .env file with KINESIS_FIREHOSE.
4. AWS Lambda and API Gateway
Ensure you have the necessary IAM roles and policies set up to allow the Lambda function to interact with your AWS services.

### 5. Set Up Docker

Ensure Docker is installed and running on your machine. Use the following Docker Compose configuration:
```
version: '3.8'

volumes:
  postgres-data:
    external: true
  pg-admin:
    external: true
  mongo-data:
    external: false
  dynamodb-data:
    external: false

services:
  postgres:
    image: postgres:14.5-bullseye
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: user
      POSTGRES_DB: postgres-data
    ports:
      - 15432:5432

  pg-admin:
    image: dpage/pgadmin4
    volumes:
      - pg-admin:/var/lib/pgadmin
    ports:
      - 8082:80
    environment:
      PGADMIN_DEFAULT_EMAIL: user@user.com
      PGADMIN_DEFAULT_PASSWORD: password
      PGADMIN_DISABLE_POSTFIX: 1

  mongo:
    image: mongo
    volumes:
      - mongo-data:/data/db
    ports:
      - 27017:27017

  dynamodb-local:
    image: amazon/dynamodb-local
    volumes:
      - dynamodb-data:/home/dynamodblocal/data
    ports:
      - 8000:8000

  express-api:
    build:
      context: ./api
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://user:${POSTGRES_PASSWORD}@postgres/postgres-data
      MONGO_URI: mongodb://mongo:27017
      DYNAMODB_ENDPOINT: http://dynamodb-local:8000
      CORS_HOST: http://localhost:5173
    ports:
      - 8001:8001
    volumes:
      - ./api:/app
    depends_on:
      - postgres
      - pg-admin
      - mongo
      - dynamodb-local

  react-app:
    build:
      context: ./src
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      - express-api

  localstack:
    image: localstack/localstack
    ports:
      - "4566-4597:4566-4597"
    environment:
      - SERVICES=lambda,s3,cloudwatch,logs
      - DEBUG=1
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
    depends_on:
      - dynamodb-local

```

### 6. Build and Run the Application
```
docker compose-ip --build
```

### 7. Deploy Serverless Functions
```
serverless deploy
```

### 8. Access the Application
* **Frontend:** Navigate to `http://localhost:3000` to access the React frontend
* **Backend:** The API is available at `http://localhost:8001`

## Directory Structure
```
joule-box/
├── api/
│   ├── routes/
│   │   ├── battery.js
│   │   ├── user.js
│   │   ├── transactions.js
│   │   ├── usage.js
│   │   └── analytics.js
│   ├── server.js
│   ├── db.js
│   ├── .env
│   ├── Dockerfile
│   └── package.json
├── src/
│   ├── components/
│   │   ├── BatteryList.tsx
│   │   └── ...
│   ├── index.tsx
│   ├── App.tsx
│   ├── Dockerfile
│   ├── .env
│   └── package.json
├── docker-compose.yml
├── serverless.yml
└── README.md
```









```

1. Create AWS credentials including the following inline IAM policy:
    ```json
    {
        "Statement": [
            {
                "Action": [
                    "apigateway:*",
                    "cloudformation:CancelUpdateStack",
                    "cloudformation:ContinueUpdateRollback",
                    "cloudformation:CreateChangeSet",
                    "cloudformation:CreateStack",
                    "cloudformation:CreateUploadBucket",
                    "cloudformation:DeleteStack",
                    "cloudformation:Describe*",
                    "cloudformation:EstimateTemplateCost",
                    "cloudformation:ExecuteChangeSet",
                    "cloudformation:Get*",
                    "cloudformation:List*",
                    "cloudformation:PreviewStackUpdate",
                    "cloudformation:UpdateStack",
                    "cloudformation:UpdateTerminationProtection",
                    "cloudformation:ValidateTemplate",
                    "dynamodb:CreateTable",
                    "dynamodb:DeleteTable",
                    "dynamodb:DescribeTable",
                    "ec2:AttachInternetGateway",
                    "ec2:AuthorizeSecurityGroupIngress",
                    "ec2:CreateInternetGateway",
                    "ec2:CreateNetworkAcl",
                    "ec2:CreateNetworkAclEntry",
                    "ec2:CreateRouteTable",
                    "ec2:CreateSecurityGroup",
                    "ec2:CreateSubnet",
                    "ec2:CreateTags",
                    "ec2:CreateVpc",
                    "ec2:DeleteInternetGateway",
                    "ec2:DeleteNetworkAcl",
                    "ec2:DeleteNetworkAclEntry",
                    "ec2:DeleteRouteTable",
                    "ec2:DeleteSecurityGroup",
                    "ec2:DeleteSubnet",
                    "ec2:DeleteVpc",
                    "ec2:Describe*",
                    "ec2:DetachInternetGateway",
                    "ec2:ModifyVpcAttribute",
                    "events:DeleteRule",
                    "events:DescribeRule",
                    "events:ListRuleNamesByTarget",
                    "events:ListRules",
                    "events:ListTargetsByRule",
                    "events:PutRule",
                    "events:PutTargets",
                    "events:RemoveTargets",
                    "iam:CreateRole",
                    "iam:DeleteRole",
                    "iam:DeleteRolePolicy",
                    "iam:GetRole",
                    "iam:PassRole",
                    "iam:PutRolePolicy",
                    "iot:CreateTopicRule",
                    "iot:DeleteTopicRule",
                    "iot:DisableTopicRule",
                    "iot:EnableTopicRule",
                    "iot:ReplaceTopicRule",
                    "kinesis:CreateStream",
                    "kinesis:DeleteStream",
                    "kinesis:DescribeStream",
                    "lambda:*",
                    "logs:CreateLogGroup",
                    "logs:DeleteLogGroup",
                    "logs:DescribeLogGroups",
                    "logs:DescribeLogStreams",
                    "logs:FilterLogEvents",
                    "logs:GetLogEvents",
                    "s3:CreateBucket",
                    "s3:DeleteBucket",
                    "s3:DeleteBucketPolicy",
                    "s3:DeleteObject",
                    "s3:DeleteObjectVersion",
                    "s3:GetObject",
                    "s3:GetObjectVersion",
                    "s3:ListAllMyBuckets",
                    "s3:ListBucket",
                    "s3:PutBucketNotification",
                    "s3:PutBucketPolicy",
                    "s3:PutBucketTagging",
                    "s3:PutBucketWebsite",
                    "s3:PutEncryptionConfiguration",
                    "s3:PutObject",
                    "sns:CreateTopic",
                    "sns:DeleteTopic",
                    "sns:GetSubscriptionAttributes",
                    "sns:GetTopicAttributes",
                    "sns:ListSubscriptions",
                    "sns:ListSubscriptionsByTopic",
                    "sns:ListTopics",
                    "sns:SetSubscriptionAttributes",
                    "sns:SetTopicAttributes",
                    "sns:Subscribe",
                    "sns:Unsubscribe",
                    "states:CreateStateMachine",
                    "states:DeleteStateMachine"
                ],
                "Effect": "Allow",
                "Resource": "*"
            }
        ],
        "Version": "2012-10-17"
    }
    ```

1. Set the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` variables in the GitLab CI/CD settings. `Settings > CI/CD > Variables`.

### Accessing Page

To view your page go to `Settings > Pages` and click on the given link.

## Development

### Running Locally

Install dependencies with:

```sh
npm install
```

Run backend server with:

```sh
npm start
```

This runs the serverless function locally using `serverless-offline` plugin.

Run frontend with:

```sh
npm run pages
```

The frontend should be available at `http://localhost:8080`

### Running Tests

```sh
npm test
```

#### Unit Tests

For the serverless backend, unit tests live with the src files as `srcFile.test.js`. The unit tests use the `serverless-jest-plugin` and lambda wrapper to simulate events to the functions and validate their outputs.

#### Feature Tests

Feature tests live in the folder `featureTests`. Those tests allow us to spin up serverless offline as a service and make requests against it and validate the results of those requests.

Feature tests double as post deploy tests when the environment variable `STACK_JSON_FILE` is specified with the path to the file generated on deployment (`stack.json`), see in `gitlab-ci.yml`.

A typical feature test will look something like:

```javascript
// This helper provides access to the serverless process and an axios instance
// to make requests against the running service.
const { serverlessProcess, serverlessService } = require('./helper.js')

describe('some_function', () => {
    beforeAll(async () => {
        // serverlessProcess.start starts serverless offline in a child process
        await serverlessProcess.start()
    })

    afterAll(() => {
        // serverlessProcess.stop kills the child process at the end of the test
        serverlessProcess.stop()
    })

    it('responds to a request', async () => {
        // The axios instance has the base url and port already, so you just have
        // to provide a route and any paramters or headers. See the axios project
        // for details.
        let response = await serverlessService.get('/some_route?param=here')

        expect(response.data.info).toEqual('amazing')
    })
});
```

## Additional information

### Getting the Endpoint URL

This project is setup with the `serverless-stack-output` plugin which is configured to output a JSON file to `./stack.json`. See [this github repo](https://github.com/sbstjn/serverless-stack-output) for more details.

### Setting up CORS

This project sets up a static website from which the serverless function is called. Therefore the function needs to handle Cross-Origin Resource Sharing (CORS).

The quick way to do that is to add the `cors: true` flag to the HTTP endpoint in `serverless.yml`:

```yaml
functions:
  hello:
    handler: src/handler.hello
    events:
      - http:
          path: hello
          method: get
          cors: true
```

Additionally, the `Access-Control-Allow-Origin` header needs to be returned in the function response:

```javascript
'use strict';

module.exports.hello = async event => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: // ...
  };
};
```

In case you want to use cookies or other authentication, add `'Access-Control-Allow-Credentials': true` to the headers as well. You will also have to set `Access-Control-Allow-Origin` to a specific origin instead of the wildcard (example: `'Access-Control-Allow-Origin': 'https://myorigin.com'`).

For more information on setting up CORS see a [blog post](https://serverless.com/blog/cors-api-gateway-survival-guide/) written by the Serverless Framework team.
