resource "aws_cognito_user_pool" "user_pool" {
  name = var.user_pool_name

  password_policy {
    minimum_length    = var.password_policy_min_length
    require_lowercase = var.password_policy_require_lowercase
    require_numbers   = var.password_policy_require_numbers
    require_symbols   = var.password_policy_require_symbols
    require_uppercase = var.password_policy_require_uppercase
  }

  schema {
    attribute_data_type = "String"
    name                = "email"
    required            = true
    mutable             = false
  }

  lambda_config {
    pre_sign_up = var.pre_sign_up_lambda_arn
  }

  auto_verified_attributes = ["email"]
}

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name                          = var.user_pool_client_name
  user_pool_id                  = aws_cognito_user_pool.user_pool.id
  generate_secret               = var.user_pool_client_generate_secret
  prevent_user_existence_errors = var.user_pool_client_prevent_user_existence_errors

  explicit_auth_flows = var.user_pool_client_explicit_auth_flows
}