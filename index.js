const crypto = require('crypto');
const AWS = require('aws-sdk');

const codebuild = new AWS.CodeBuild({ apiVersion: '2016-10-06' });
const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    
    const data = await dynamodb.get({
        TableName: process.env.DYNAMO_TABLE,
        Key: {
            ref: body.ref,
            repo: body.repository.full_name
        }
    }).promise();
    
    const sig = `sha1=${crypto.createHmac('sha1', data.Item.githubWebhookSecret).update(event.body).digest('hex')}`;
    if (sig !== event.headers['X-Hub-Signature']) throw new Error('Unauthorized Signature');
    
    if (body.ref === data.Item.ref) {
        console.log({
            ref: body.ref,
            repo: body.repository.full_name,
            codeBuild: data.Item.codeBuildProject
        });
        await codebuild.startBuild({
            projectName: data.Item.codeBuildProject
        }).promise();
    }
    const response = {
        statusCode: 200,
        body: null,
    };
    return response;
};
