# Email Verification Lambda

This Lambda function handles custom email verification for Cognito users.

## Overview

When a user signs up, Cognito triggers a CustomMessage Lambda that sends an email with a verification link pointing to this API Gateway endpoint. When clicked, this Lambda:

1. Validates the username and code parameters
2. Confirms the user in Cognito using AdminConfirmSignUp
3. Redirects to a success page or returns a 400 error

## Build and Deploy

The Lambda is automatically built and deployed by CDK. To build manually:

```bash
cd lambda/verification
dotnet restore
dotnet publish -c Release -o out
```

## Environment Variables

- `USER_POOL_ID`: The Cognito User Pool ID
- `WEBSITE_URL`: The website URL for redirects (e.g., https://example.com)

## API Endpoint

GET /verify?username={username}&code={code}

### Success Response
- Status: 302 (Redirect)
- Location: {WEBSITE_URL}/account/verification-success

### Error Response
- Status: 400
- Body: { "message": "Verification Failed" }
