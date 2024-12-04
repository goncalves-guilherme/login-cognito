module "cognito" {
  source = "./modules/cognito"

  aws_profile = var.aws_profile
  aws_region = var.aws_region

  user_pool_name                          = var.user_pool_name
  pre_sign_up_lambda_arn                  = module.lambda.lambda_function_arn
  
  password_policy_min_length              = var.password_policy_min_length
  password_policy_require_lowercase       = var.password_policy_require_lowercase
  password_policy_require_numbers         = var.password_policy_require_numbers
  password_policy_require_symbols         = var.password_policy_require_symbols
  password_policy_require_uppercase       = var.password_policy_require_uppercase

  user_pool_client_name                   = var.user_pool_client_name
  user_pool_client_generate_secret        = var.user_pool_client_generate_secret
  user_pool_client_prevent_user_existence_errors = var.user_pool_client_prevent_user_existence_errors
  user_pool_client_explicit_auth_flows    = var.user_pool_client_explicit_auth_flows
}

module "lambda" {
  source = "./modules/lambda"

  lambda_function_name = var.lambda_function_name
  lambda_code_path     = var.lambda_code_path
  lambda_handler       = var.lambda_handler
  lambda_runtime       = var.lambda_runtime

  user_pool_id         = module.cognito.user_pool_id
  user_pool_arn        = module.cognito.user_pool_arn 
}