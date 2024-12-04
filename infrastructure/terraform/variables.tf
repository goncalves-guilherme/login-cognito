# Cognito Configuration
variable "aws_region" {
  description = "The AWS region to create resources in."
  type        = string
  default     = "eu-west-2"
}

variable "aws_profile" {
  description = "The AWS CLI profile to use."
  type        = string
  default     = "default"
}

variable "user_pool_name" {
  description = "The name of the Cognito User Pool."
  type        = string
  default     = "my_user_pool"
}

variable "password_policy_min_length" {
  description = "Minimum length of the password."
  type        = number
  default     = 8
}

variable "password_policy_require_lowercase" {
  description = "Whether to require lowercase letters in the password."
  type        = bool
  default     = true
}

variable "password_policy_require_numbers" {
  description = "Whether to require numbers in the password."
  type        = bool
  default     = true
}

variable "password_policy_require_symbols" {
  description = "Whether to require symbols in the password."
  type        = bool
  default     = true
}

variable "password_policy_require_uppercase" {
  description = "Whether to require uppercase letters in the password."
  type        = bool
  default     = true
}

variable "user_pool_client_name" {
  description = "The name of the Cognito User Pool Client."
  type        = string
  default     = "my_user_pool_client"
}

variable "user_pool_client_generate_secret" {
  description = "Whether to generate a client secret."
  type        = bool
  default     = false
}

variable "user_pool_client_prevent_user_existence_errors" {
  description = "Prevents user existence errors."
  type        = string
  default     = "ENABLED"
}

variable "user_pool_client_explicit_auth_flows" {
  description = "The explicit authentication flows enabled for the user pool client."
  type        = list(string)
  default     = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]
}

# Lambda Configuration
variable "lambda_function_name" {
  description = "The name of the Lambda function."
  type        = string
  default     = "pre_sign_up_function"
}

variable "lambda_handler" {
  description = "The handler for the Lambda function."
  type        = string
  default     = "index.main"
}

variable "lambda_runtime" {
  description = "The runtime for the Lambda function."
  type        = string
  default     = "python3.12"
}

variable "lambda_code_path" {
  description = "The path to the Lambda function code zip file."
  type        = string
  default     = "./modules/lambda/lambda_function/pre_sign_up.zip"
}