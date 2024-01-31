const aws = require("aws-sdk")
const {randomUUID} = require("crypto")

const settings = process.env.IS_OFFLINE
    ? {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        credentials: {
            accessKeyId: 'MockAccessKeyId',
            secretAccessKey: 'MockSecretAccessKey',
        }
    }
    : {};

const dynamodb = new aws.DynamoDB.DocumentClient(settings)

const validInputs = (body) => {
    return true
};

const createParams = (body) => ({
    TableName: 'usersTable',
    Item: {
        pk: randomUUID(),
        name: body.name,
        phone: body.phone,
        age: body.age
    }
});

const createUser = async (event, context) => {
    let body = JSON.parse(event.body)

    if(!validInputs(body)){
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid inputs' }),
        };
    }

    const params = createParams(body);

    try {
        const res = await dynamodb.put(params).promise();
        return {
            statusCode: 201,
            body: JSON.stringify({data: params.Item}),
        };
    } catch (error) {
        console.error('Error occurred while fetching data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: error.message}),
        };
    }
}

module.exports = {
    createUser
}