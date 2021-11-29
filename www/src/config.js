// You can obtain these values by running:
// aws cloudformation describe-stacks --stack-name <YOUR STACK NAME> --query "Stacks[0].Outputs[]"

const config = {
  "aws_user_pools_web_client_id": "3ndanln1vavn8up941ggv5ktee",     // CognitoClientID
  "api_base_url": "https://x0uc66zprk.execute-api.us-east-1.amazonaws.com/prod",                                     // TodoFunctionApi
  "cognito_hosted_domain": "mytodoappdemo-lambda-webapp-cf.auth.us-east-1.amazoncognito.com",                   // CognitoDomainName
  "redirect_url": "https://master.d1miyvz1qrjpmq.amplifyapp.com"                                      // AmplifyURL
};

export default config;
