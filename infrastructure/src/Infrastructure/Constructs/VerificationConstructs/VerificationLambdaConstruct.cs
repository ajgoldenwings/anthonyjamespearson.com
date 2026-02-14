using Amazon.CDK;
using Amazon.CDK.AWS.Lambda;
using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.Cognito;
using Constructs;
using System.Collections.Generic;

namespace Infrastructure.Constructs
{
    internal class VerificationLambdaConstructProps
    {
        public string Name { get; set; }
        public string WebsiteUrl { get; set; }
        public UserPool UserPool { get; set; }
    }

    public class VerificationLambdaConstruct : Construct
    {
        public Function Function { get; }

        internal VerificationLambdaConstruct(Construct scope, string id, VerificationLambdaConstructProps props) : base(scope, id)
        {
            Function = new Function(this, "VerificationFunction", new FunctionProps
            {
                Runtime = Runtime.DOTNET_8,
                Handler = "VerificationLambda::VerificationLambda.Function::FunctionHandler",
                Code = Code.FromAsset("./lambda/verification/bin/Release/net8.0"),
                Environment = new Dictionary<string, string>
                {
                    { "USER_POOL_ID", props.UserPool.UserPoolId },
                    { "WEBSITE_URL", props.WebsiteUrl }
                },
                Timeout = Duration.Seconds(30)
            });

            // Grant permissions to confirm user sign up and get user info
            Function.AddToRolePolicy(new PolicyStatement(new PolicyStatementProps
            {
                Effect = Effect.ALLOW,
                Actions = new[] 
                { 
                    "cognito-idp:AdminConfirmSignUp",
                    "cognito-idp:AdminGetUser"
                },
                Resources = new[] { props.UserPool.UserPoolArn }
            }));
        }
    }
}
