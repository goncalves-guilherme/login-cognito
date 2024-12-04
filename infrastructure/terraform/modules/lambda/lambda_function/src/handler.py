import boto3

def lambda_handler(event, context):
    client = boto3.client('cognito-idp')
    user_pool_id = event['userPoolId']
    email = event['request']['userAttributes']['email']
    
    try:
        response = client.list_users(
            UserPoolId=user_pool_id,
            Filter=f'email = "{email}"',
            Limit=1
        )
        if len(response['Users']) > 0:
            raise ValueError('Email already exists')

        return event

    except ValueError as e:
        raise Exception(str(e))
