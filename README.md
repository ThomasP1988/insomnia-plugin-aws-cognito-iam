
Plugin to send request to API Gateway with AWS Cognito and AWS IAM authorization type

# How to use

 ## 1. define your users ##

 Go to "Manage Environements", 

 
 ![Define environement](/doc/img/manage-environement.png)
 
 then in the JSON, add your different user:
 ![fill environement](/doc/img/environement.png)

into the "", start to type AWS Cognito IAM, click on the popover and start to fill the information.

 ## 2. fill the header and send you request ##
Once this is done,

in your request, click on headers, and add a new header named "InsomniaPluginAWSIAM" and as value start to type your JSON property name (here: user.DEV_ADMIN) click on it.

![header and timeline](/doc/img/header.png)



