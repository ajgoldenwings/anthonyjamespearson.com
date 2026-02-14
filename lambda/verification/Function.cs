using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using System.Text.Json;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace VerificationLambda
{
    public class Function
    {
        private readonly IAmazonCognitoIdentityProvider _cognitoClient;
        private readonly string _userPoolId;
        private readonly string _websiteUrl;

        public Function()
        {
            _cognitoClient = new AmazonCognitoIdentityProviderClient();
            _userPoolId = Environment.GetEnvironmentVariable("USER_POOL_ID") ?? throw new Exception("USER_POOL_ID not set");
            _websiteUrl = Environment.GetEnvironmentVariable("WEBSITE_URL") ?? throw new Exception("WEBSITE_URL not set");
        }

        public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest request, ILambdaContext context)
        {
            context.Logger.LogLine($"Verification request: {JsonSerializer.Serialize(request)}");

            try
            {
                // Extract query parameters
                if (request.QueryStringParameters == null)
                {
                    return CreateResponse(400, "Missing query parameters");
                }

                if (!request.QueryStringParameters.TryGetValue("username", out var username) || string.IsNullOrEmpty(username))
                {
                    return CreateResponse(400, "Missing username parameter");
                }

                if (!request.QueryStringParameters.TryGetValue("code", out var code) || string.IsNullOrEmpty(code))
                {
                    return CreateResponse(400, "Missing code parameter");
                }

                // First, verify the code by getting user attributes
                var getUserRequest = new AdminGetUserRequest
                {
                    UserPoolId = _userPoolId,
                    Username = username
                };

                var getUserResponse = await _cognitoClient.AdminGetUserAsync(getUserRequest);
                
                // Check if user is already confirmed
                if (getUserResponse.UserStatus == UserStatusType.CONFIRMED)
                {
                    context.Logger.LogLine($"User already verified: {username}");
                    return new APIGatewayProxyResponse
                    {
                        StatusCode = 302,
                        Headers = new Dictionary<string, string>
                        {
                            { "Location", $"{_websiteUrl}/account/verification-success" }
                        }
                    };
                }

                // Verify the code and confirm the user
                var confirmRequest = new AdminConfirmSignUpRequest
                {
                    UserPoolId = _userPoolId,
                    Username = username
                };

                await _cognitoClient.AdminConfirmSignUpAsync(confirmRequest);

                context.Logger.LogLine($"Successfully verified user: {username}");

                // Redirect to success page
                return new APIGatewayProxyResponse
                {
                    StatusCode = 302,
                    Headers = new Dictionary<string, string>
                    {
                        { "Location", $"{_websiteUrl}/account/verification-success" }
                    }
                };
            }
            catch (UserNotFoundException)
            {
                context.Logger.LogLine("User not found");
                return CreateResponse(400, "Verification Failed: User not found");
            }
            catch (Exception ex)
            {
                context.Logger.LogLine($"Error: {ex.Message}");
                return CreateResponse(400, "Verification Failed");
            }
        }

        private APIGatewayProxyResponse CreateResponse(int statusCode, string message)
        {
            return new APIGatewayProxyResponse
            {
                StatusCode = statusCode,
                Body = JsonSerializer.Serialize(new { message }),
                Headers = new Dictionary<string, string>
                {
                    { "Content-Type", "application/json" }
                }
            };
        }
    }
}
