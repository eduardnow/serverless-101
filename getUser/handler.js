const aws = require("aws-sdk")

let settings = {};
if(process.env.IS_OFFLINE) {
    settings = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        credentials: {
            accessKeyId: 'MockAccessKeyId',
            secretAccessKey: 'MockSecretAccessKey',
        },
    };
}

const dynamodb = new aws.DynamoDB.DocumentClient(settings)

const getUser = async (event, context) => {

    let userId = event.pathParameters.id

    const params = {
        ExpressionAttributeValues: {':pk': userId},
        KeyConditionExpression: 'pk = :pk',
        TableName: 'usersTable'
    }

    try {
        const res = await dynamodb.query(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({data: res.Items[0] }),
        };
    } catch (error) {
        console.error('Error occurred while fetching data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'}),
        };
    }
}

module.exports = {
    getUser
}
