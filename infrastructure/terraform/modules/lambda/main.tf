resource "aws_iam_role" "lambda_cognito_role" {
  name = "lambda_cognito_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# lambda_cognito_role has basic policy to manage cloud watch logs
resource "aws_iam_role_policy_attachment" "lambda_cognito_policy_attachment" {
  role       = aws_iam_role.lambda_cognito_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# lambda_cognito_role has policy to list all users from cognito user pool to check for duplicated email sign up
resource "aws_iam_role_policy" "lambda_cognito_custom_policy" {
  name = "lambda_cognito_custom_policy"
  role = aws_iam_role.lambda_cognito_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = [
        "cognito-idp:ListUsers",
        "cognito-idp:AdminGetUser",
        "cognito-idp:AdminCreateUser"
      ],
      Effect   = "Allow",
      Resource = "*"
    }]
  })
}

resource "aws_lambda_function" "pre_sign_up_function" {
  filename      = var.lambda_code_path
  function_name = var.lambda_function_name
  role          = aws_iam_role.lambda_cognito_role.arn
  handler       = var.lambda_handler
  runtime       = var.lambda_runtime

  source_code_hash = filebase64sha256(var.lambda_code_path)
}

# Adds permission to cognito to call the lambda function right after sign up action
resource "aws_lambda_permission" "allow_cognito_invoke_lambda" {
  statement_id  = "AllowCognitoInvokeLambda"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.pre_sign_up_function.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = var.user_pool_arn
}
