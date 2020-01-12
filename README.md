# Lambda/DynamoDB/CodeBuild Github Webhook Deploy Script
## Serverless deployments with Github Webhooks

Create a table in DynamoDB with a hash key called `ref` and a range key called `repo`. Enter the table name as the `DYNAMO_TABLE` environment variable in the Lambda function. Then hook up an API Gateway trigger and udpate your repo with the webhook URL. 

The DynamoDB payload should look like this:

```
{
	ref: 'ref/heads/master',
	repo: 'djmeph/lambda-dynamodb-codebuild-github-webhook-deploy',
	codeBuildProject: 'codebuild-project-name',
	githubWebhookSecret: 'xxxxxxxxxxxxxxxxx'
}
```
