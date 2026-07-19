# Infrastructure

AWS CDK infrastructure for anthonyjamespearson.com, written in C#/.NET 10.

The `cdk.json` file tells the CDK Toolkit how to execute your app using the .NET CLI.

## Requirements

- [.NET 10 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/10.0)
- Node.js and npm
- AWS CDK CLI: `npm install -g aws-cdk`
- AWS credentials configured: `aws sts get-caller-identity`

## Useful Commands

| Command | Description |
|---|---|
| `dotnet build src` | Compile the CDK app |
| `cdk synth` | Emit the synthesized CloudFormation template |
| `cdk diff` | Compare deployed stack with current state |
| `cdk deploy` | Deploy this stack to your default AWS account/region |
| `cdk destroy` | Tear down the deployed stack |

## Stack Overview

The CDK app provisions the following AWS resources:

- **S3** — Static website hosting for the Angular SPA
- **CloudFront** — CDN with custom domain, SSL/TLS, security headers, and SPA error handling
- **Route 53** — A records for apex and www subdomain
- **ACM** — SSL certificate with DNS validation
- **Cognito** — User Pool with email sign-up, SES integration, and custom message triggers
- **API Gateway** — REST API for the email verification endpoint (`GET /verify`)
- **Lambda (Verification)** — .NET 10 function that confirms Cognito sign-ups
- **Lambda (Custom Message)** — Node.js 24 inline function for branded HTML emails

## Project Structure

```
src/Infrastructure/
├── Constructs/
│   ├── BucketConstruct.cs                        # S3 bucket
│   ├── BucketDeploymentConstruct.cs              # S3 deployment + cache invalidation
│   ├── DistributionConstruct.cs                  # CloudFront + Route 53 + ACM
│   ├── CognitoConstruct.cs                       # Cognito User Pool + client
│   ├── CustomMessageLambda.cs                    # Node.js 24 email template lambda
│   └── VerificationConstructs/
│       ├── VerificationApiConstruct.cs           # API Gateway
│       └── VerificationLambdaConstruct.cs        # .NET 10 verification lambda
├── InfrastructureStack.cs                        # Main stack composition
└── Program.cs                                    # CDK app entry point
```

## Context Variables

The CDK app requires the following context values (set in `cdk.json` or passed via `--context`):

| Key | Description | Example |
|---|---|---|
| `account` | AWS account ID | `123456789012` |
| `region` | AWS region | `us-east-1` |
| `name` | Domain name | `anthonyjamespearson.com` |
