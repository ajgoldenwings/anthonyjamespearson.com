using Amazon.CDK;
using Amazon.CDK.AWS.Cognito;
using Constructs;

namespace Infrastructure.Constructs
{
    internal class CognitoConstructProps : IStackProps
    {
        public string Name;
        public string DomainName;
    }

    public class CognitoConstruct : Construct
    {
        public UserPool UserPool;
        public UserPoolClient UserPoolClient;

        internal CognitoConstruct(Construct scope, string id, CognitoConstructProps props = null) : base(scope, id)
        {
            UserPool = new UserPool(this, "UserPool", new UserPoolProps
            {
                UserPoolName = $"{props.Name}-user-pool",
                SelfSignUpEnabled = true,
                SignInAliases = new SignInAliases
                {
                    Email = true
                },
                AutoVerify = new AutoVerifiedAttrs
                {
                    Email = true
                },
                UserVerification = new UserVerificationConfig
                {
                    EmailStyle = VerificationEmailStyle.LINK,
                    EmailSubject = "Verify your email",
                    EmailBody = "Thanks for signing up! Click the link below to verify your email address: {##Verify Email##}"
                },
                StandardAttributes = new StandardAttributes
                {
                    Email = new StandardAttribute
                    {
                        Required = true,
                        Mutable = true
                    }
                },
                PasswordPolicy = new PasswordPolicy
                {
                    MinLength = 8,
                    RequireLowercase = true,
                    RequireUppercase = true,
                    RequireDigits = true,
                    RequireSymbols = true
                },
                AccountRecovery = AccountRecovery.EMAIL_ONLY,
                Email = UserPoolEmail.WithCognito("noreply@verificationemail.com"),
                RemovalPolicy = RemovalPolicy.DESTROY
            });

            // Add Cognito domain for hosted UI (required for LINK verification style)
            var userPoolDomain = new UserPoolDomain(this, "CognitoDomain", new UserPoolDomainProps
            {
                UserPool = UserPool,
                CognitoDomain = new CognitoDomainOptions
                {
                    DomainPrefix = props.Name.ToLower()
                }
            });

            UserPoolClient = new UserPoolClient(this, "UserPoolClient", new UserPoolClientProps
            {
                UserPool = UserPool,
                UserPoolClientName = $"{props.Name}-client",
                AuthFlows = new AuthFlow
                {
                    UserPassword = true,
                    UserSrp = true
                },
                PreventUserExistenceErrors = true
            });

            _ = new CfnOutput(this, "UserPoolId", new CfnOutputProps
            {
                Value = UserPool.UserPoolId,
                Description = "Cognito User Pool ID"
            });

            _ = new CfnOutput(this, "UserPoolClientId", new CfnOutputProps
            {
                Value = UserPoolClient.UserPoolClientId,
                Description = "Cognito User Pool Client ID"
            });

            _ = new CfnOutput(this, "UserPoolDomain", new CfnOutputProps
            {
                Value = userPoolDomain.DomainName,
                Description = "Cognito User Pool Domain"
            });
        }
    }
}
