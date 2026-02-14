using Amazon.CDK;
using Amazon.CDK.AWS.APIGateway;
using Amazon.CDK.AWS.Lambda;
using Constructs;

namespace Infrastructure.Constructs
{
    internal class VerificationApiConstructProps
    {
        public string Name { get; set; }
        public Function VerificationFunction { get; set; }
    }

    public class VerificationApiConstruct : Construct
    {
        public RestApi Api { get; }
        public string VerificationUrl { get; }

        internal VerificationApiConstruct(Construct scope, string id, VerificationApiConstructProps props) : base(scope, id)
        {
            Api = new RestApi(this, "VerificationApi", new RestApiProps
            {
                RestApiName = $"{props.Name}-verification-api",
                Description = "API for email verification",
                DefaultCorsPreflightOptions = new CorsOptions
                {
                    AllowOrigins = Cors.ALL_ORIGINS,
                    AllowMethods = Cors.ALL_METHODS
                }
            });

            var verifyResource = Api.Root.AddResource("verify");
            var verifyIntegration = new LambdaIntegration(props.VerificationFunction);
            
            verifyResource.AddMethod("GET", verifyIntegration);

            // VerificationUrl = $"{Api.Url}verify";
            // TODO: replace us-east-1, prod with context values
            VerificationUrl = Fn.Join("", new[] { Api.RestApiId, ".execute-api.us-east-1.amazonaws.com/prod/verify" });

            _ = new CfnOutput(this, "VerificationApiUrl", new CfnOutputProps
            {
                Value = VerificationUrl,
                Description = "Email Verification API URL"
            });
        }
    }
}
