using Amazon.CDK;
using Amazon.CDK.AWS.Lambda;
using Amazon.CDK.AWS.IAM;
using Constructs;
using System.Collections.Generic;

namespace Infrastructure.Constructs
{
    internal class CustomMessageLambdaProps
    {
        public string Name { get; set; }
        public string WebsiteUrl { get; set; }
    }

    public class CustomMessageLambda : Construct
    {
        public Function Function { get; }

        internal CustomMessageLambda(Construct scope, string id, CustomMessageLambdaProps props) : base(scope, id)
        {
            Function = new Function(this, "CustomMessageFunction", new FunctionProps
            {
                Runtime = Runtime.NODEJS_20_X,
                Handler = "index.handler",
                Code = Code.FromInline(@"
exports.handler = async (event) => {
    console.log('Custom message trigger:', JSON.stringify(event, null, 2));
    
    const websiteUrl = process.env.WEBSITE_URL;
    
    if (event.triggerSource === 'CustomMessage_ForgotPassword') {
        const email = event.request.userAttributes.email;
        const code = event.request.codeParameter;
        const resetUrl = `${websiteUrl}/account/reset-password?email=${encodeURIComponent(email)}&code=${code}`;
        
        event.response.emailSubject = 'Reset your password';
        event.response.emailMessage = `
            <html>
                <body>
                    <h2>Reset Your Password</h2>
                    <p>You requested to reset your password. Click the link below to set a new password:</p>
                    <p><a href=""${resetUrl}"" style=""display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;"">Reset Password</a></p>
                    <p>Or copy and paste this link into your browser:</p>
                    <p>${resetUrl}</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                </body>
            </html>
        `;
    }
    
    return event;
};
"),
                Environment = new Dictionary<string, string>
                {
                    { "WEBSITE_URL", props.WebsiteUrl }
                },
                Timeout = Duration.Seconds(10)
            });
        }
    }
}
