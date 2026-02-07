export const environment = {
  production: true,
  aws: {
    region: 'us-east-1', // Update with your region
    userPoolId: '', // Will be populated after CDK deploy
    userPoolClientId: '' // Will be populated after CDK deploy
  }
};
