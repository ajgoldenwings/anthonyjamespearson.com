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
                    Email = false
                },
                UserVerification = new UserVerificationConfig
                {
                    EmailStyle = VerificationEmailStyle.LINK
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
                RemovalPolicy = RemovalPolicy.DESTROY
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
        }
    }
}
