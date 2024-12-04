variable "aws_region" {
  description = "The AWS region to create resources in."
  type        = string
}

variable "aws_profile" {
  description = "The AWS CLI profile to use."
  type        = string
}

variable "user_pool_name" {
  description = "The name of the Cognito User Pool."
  type        = string
}

variable "password_policy_min_length" {
  description = "Minimum length of the password."
  type        = number
}

variable "password_policy_require_lowercase" {
  description = "Whether to require lowercase letters in the password."
  type        = bool
}

variable "password_policy_require_numbers" {
  description = "Whether to require numbers in the password."
  type        = bool
}

variable "password_policy_require_symbols" {
  description = "Whether to require symbols in the password."
  type        = bool
}

variable "password_policy_require_uppercase" {
  description = "Whether to require uppercase letters in the password."
  type        = bool
}

variable "user_pool_client_name" {
  description = "The name of the Cognito User Pool Client."
  type        = string
}

variable "user_pool_client_generate_secret" {
  description = "Whether to generate a client secret."
  type        = bool
}

variable "user_pool_client_prevent_user_existence_errors" {
  description = "Prevents user existence errors."
  type        = string
}

variable "user_pool_client_explicit_auth_flows" {
  description = "The explicit authentication flows enabled for the user pool client."
  type        = list(string)
}

variable "pre_sign_up_lambda_arn" {
  description = "The arn value to identify the lambda to be called before the signup cognito action."
  type = string
}
