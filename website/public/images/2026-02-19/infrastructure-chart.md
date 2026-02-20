# Infrastructure Architecture Chart

## Overview
AWS CDK Infrastructure for a serverless web application with authentication and email verification.

## Architecture Diagram

```mermaid
%%{init: {'themeVariables': {'fontSize': '14px'}, 'flowchart': {'nodeSpacing': 50, 'rankSpacing': 60, 'padding': 10}}}%%
graph TB
    User[👤 User/Browser]
    
    subgraph DNS["🌐 Route 53 DNS"]
        Route53["A Records<br/>• domain → CloudFront<br/>• www\.domain → CloudFront<br/>• Certificate Validation"]
    end
    
    subgraph CDN["☁️ CloudFront Distribution"]
        CloudFront["CDN Layer<br/>• Custom Domain + SSL/TLS<br/>• Security Headers CSP, HSTS<br/>• Caching: /assets/* optimized<br/>• Caching: /index.html disabled<br/>• Error: 403/404 → /index.html"]
    end
    
    subgraph Storage["📦 S3 Bucket"]
        S3["Static Website Hosting<br/>• SPA Application Files<br/>• Source: ./website/dist/...<br/>• Auto-delete enabled"]
    end
    
    subgraph Auth["🔐 Cognito User Pool"]
        Cognito["User Authentication<br/>• Email-based sign-in<br/>• Self-registration<br/>• Email verification required<br/>• Password policy<br/>• OAuth 2.0 Implicit Grant<br/>• Cognito Domain hosted UI"]
        CognitoClient["User Pool Client<br/>• Auth flows:<br/>&nbsp;&nbsp;&nbsp;&nbsp;UserPassword<br/>&nbsp;&nbsp;&nbsp;&nbsp;UserSRP<br/>• Callback: /account/login"]
        CustomMsg["Custom Message Lambda<br/>Node.js 20<br/>• Triggers<br/>&nbsp;&nbsp;&nbsp;&nbsp;SignUp<br/>&nbsp;&nbsp;&nbsp;&nbsp;ResendCode<br/>&nbsp;&nbsp;&nbsp;&nbsp;ForgotPassword<br/>• Generates HTML emails<br/>• Creates verification links"]
    end
    
    subgraph Verification["✉️ Email Verification System"]
        API["API Gateway REST API<br/>• Endpoint: GET /verify<br/>• CORS enabled<br/>• URL: /prod/verify"]
        VerifyLambda["Verification Lambda<br/>.NET 8 Runtime<br/>• AdminConfirmSignUp<br/>• AdminGetUser<br/>• AdminUpdateUserAttributes<br/>• Timeout: 30s"]
    end
    
    subgraph Email["📧 Amazon SES"]
        SES["Email Service<br/>• Domain: anthonyjamespearson.com<br/>• From: noreply@...<br/>• Region: us-east-1"]
    end
    
    User -->|HTTPS| Route53
    Route53 -->|DNS Resolution| CloudFront
    User -->|HTTPS Request| CloudFront
    CloudFront -->|Origin Access Control| S3
    
    User -->|Register/Login| Cognito
    Cognito -->|OAuth Flow| CognitoClient
    Cognito -->|Trigger Event| CustomMsg
    CustomMsg -->|Generate Email| SES
    SES -->|Send Email| User
    
    User -->|Click Verify Link| API
    API -->|Lambda Integration| VerifyLambda
    VerifyLambda -->|Confirm User| Cognito
    VerifyLambda -->|Redirect| User
    
    CustomMsg -.->|Reference| API
    
    classDef leftAlign text-align:left
    
    class User,Route53,CloudFront,S3,Cognito,CognitoClient,CustomMsg,API,VerifyLambda,SES leftAlign
    
    style User fill:#e1f5ff
    style CloudFront fill:#ff9900
    style S3 fill:#ff9900
    style Route53 fill:#ff9900
    style Cognito fill:#dd344c
    style CognitoClient fill:#dd344c
    style CustomMsg fill:#ff9900
    style API fill:#ff4f8b
    style VerifyLambda fill:#ff9900
    style SES fill:#dd344c
```

## Component Details

### 1. Frontend Layer
- **CloudFront Distribution**: CDN with custom domain, SSL/TLS, security headers
- **S3 Bucket**: Static website hosting for SPA application
- **Route 53**: DNS management with A records for domain and www subdomain

### 2. Authentication Layer
- **Cognito User Pool**: User authentication and management
  - Email-based authentication
  - Self-registration with email verification
  - Password policy enforcement
  - OAuth 2.0 support
- **User Pool Client**: Application client for frontend integration

### 3. Email System
- **Custom Message Lambda**: Customizes Cognito email templates
  - Sign-up verification emails
  - Password reset emails
  - HTML formatted with branded styling
- **Amazon SES**: Email delivery service
  - Verified domain integration
  - Professional sender address

### 4. Verification System
- **API Gateway**: REST API endpoint for email verification
- **Verification Lambda**: Processes verification requests
  - Confirms user sign-up in Cognito
  - Updates user attributes
  - Handles redirects to website

## Data Flow

### User Registration Flow
```
1. User submits registration → Frontend
2. Frontend → Cognito User Pool (CreateUser)
3. Cognito → Custom Message Lambda (trigger)
4. Custom Message Lambda → Generates email with verification link
5. Cognito → SES → Sends email to user
6. User clicks link → API Gateway (/verify endpoint)
7. API Gateway → Verification Lambda
8. Verification Lambda → Cognito (AdminConfirmSignUp)
9. Verification Lambda → Redirects user to website
10. User can now log in
```

### Static Content Delivery Flow
```
1. User requests page → CloudFront
2. CloudFront checks cache
3. If miss → S3 Bucket (Origin)
4. CloudFront → Applies security headers
5. CloudFront → Returns content to user
```

## Stack Outputs
- Bucket Name
- Bucket Website URL
- CloudFront Distribution URL
- Cognito User Pool ID
- Cognito User Pool Client ID
- Cognito User Pool Domain
- Verification API URL

## Security Features
- HTTPS only (TLS 1.2+)
- Content Security Policy (CSP)
- Strict Transport Security (HSTS)
- X-Frame-Options (DENY)
- XSS Protection
- Origin Access Control for S3
- IAM least privilege for Lambda functions
- Cognito password policy enforcement

## Deployment Requirements
- AWS CDK context: `account`, `region`, `name`
- Pre-built website in `./website/dist/website/browser`
- Route 53 hosted zone for domain
- SES verified domain
