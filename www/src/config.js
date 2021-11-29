// You can obtain these values by running:
// aws cloudformation describe-stacks --stack-name <YOUR STACK NAME> --query "Stacks[0].Outputs[]"

const config = {
  "aws_user_pools_web_client_id": "3fmrc5ph5akvm1modmpsg3ti8l",     // CognitoClientID
  "api_base_url": "https://z9ts5txsl8.execute-api.us-east-1.amazonaws.com/prod",                                     // TodoFunctionApi
  "cognito_hosted_domain": "mytodoappdemo-lambda-webapp-cf.auth.us-east-1.amazoncognito.com",                   // CognitoDomainName
  "redirect_url": "https://master.d1501agjbllai9.amplifyapp.com"                                      // AmplifyURL
};

export default config;
