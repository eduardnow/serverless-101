import os
import json
import boto3
from botocore.exceptions import BotoCoreError, ClientError


def get_dynamodb_resource():
    if os.getenv('IS_OFFLINE', False):
        boto3.Session(
            aws_access_key_id='MockAccessKeyId',
            aws_secret_access_key='MockSecretAccessKey'
        )
        return boto3.resource('dynamodb', endpoint_url='http://localhost:8000')
    else:
        return boto3.resource('dynamodb')


def delete_user(event, context):
    client = get_dynamodb_resource()
    table = client.Table('usersTable')

    try:
        user_id = event['pathParameters']['id']
        result = table.delete_item(Key={'pk': user_id})
    except (BotoCoreError, ClientError) as e:
        # Return error message in case of exceptions
        return {
            'statusCode': 500,
            'body': json.dumps({'error_message': str(e)})
        }

    body = json.dumps({'message': f"user {user_id} deleted"})

    return {
        'status_code': result['ResponseMetadata']['HTTPStatusCode'],
        'body': body
    }
