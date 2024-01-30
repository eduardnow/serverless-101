
const hello = async (event, context) => {
    return {
        "statusCode": 200,
        "body": JSON.stringify({ 'message': 'Actualizando mi primera aplicación en AWS Lambda'})
    }
}

module.exports = {
    hello
}
