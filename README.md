# insomnia-plugin-aws-cognito-iam
Plugin to send request to API Gateway with AWS Cognito and AWS IAM authorization type

 ## How to use ##
 
 Go to "Manage Environements", then in the JSON, add your different user:

{
  "DEV_ADMIN": ""
}

into the "", start to type AWS Cognito IAM, click on the popover and start to fill the information.

Once this is done,

in your request, click on headers, and add a new header named "InsomniaPluginAWSIAM" and as value start to type your JSON property name (here: DEV_ADMIN) click on it.



