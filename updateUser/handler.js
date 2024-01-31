const aws = require("aws-sdk")
const { randomUUID } = require("crypto")
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
    return !(!body || !body.name || !body.phone || !body.age);
};

const createParams = (body, userId) => ({
    TableName: 'usersTable',
    Key: { pk: userId },
    UpdateExpression: "SET #name = :name, #phone = :phone, #age = :age",
    ExpressionAttributeNames: {
        "#name": "name",
        "#phone": "phone",
        "#age": "age"
    },
    ExpressionAttributeValues: {
        ":name": body.name,
        ":phone": body.phone,
        ":age": body.age,
    },
    ReturnValues: "ALL_NEW"
});

const updateUser = async (event, context) => {
    let id = event.pathParameters.id
    let body = JSON.parse(event.body)
    if (!validInputs(body)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid inputs' }),
        };
    }
    const params = createParams(body, id);
    try {
        const res = await dynamodb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ data: res.Attributes }),
        };
    } catch (error) {
        console.error('Error occurred while updating data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'error while updating user' }),
        };
    }
}

module.exports = {
    updateUser
}