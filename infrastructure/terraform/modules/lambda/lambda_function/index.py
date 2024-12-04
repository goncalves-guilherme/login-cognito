from src.handler import lambda_handler

def main(event, context):
    return lambda_handler(event, context)
