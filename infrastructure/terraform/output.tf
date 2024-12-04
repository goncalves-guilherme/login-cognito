output "all_s3_module_outputs" {
  value = local.module_login_s3_outputs
  description = "All outputs from the s3 login module"
}

output "all_cnd_module_outputs" {
  value = local.module_cdn_outputs
  description = "All outputs from the cdn module"
}

/*
output "user_pool_id" {
  description = "The ID of the Cognito User Pool."
  value       = module.cognito.user_pool_id
}

output "user_pool_client_id" {
  description = "The ID of the Cognito User Pool Client."
  value       = module.cognito.user_pool_client_id
}
*/