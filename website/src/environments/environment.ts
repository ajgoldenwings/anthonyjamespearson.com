export const environment = {
  production: false,
  aws: {
    region: 'us-east-1', // Update with your region
    userPoolId: '', // Will be populated after CDK deploy
    userPoolClientId: '' // Will be populated after CDK deploy
  }
};
