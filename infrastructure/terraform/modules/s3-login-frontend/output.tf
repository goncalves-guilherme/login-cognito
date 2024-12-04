output "bucket_name" {
  description = "The name of the S3 bucket"
  value       = aws_s3_bucket.react_app_bucket.bucket
}

output "website_url" {
  description = "The S3 bucket static website endpoint"
  value       = aws_s3_bucket_website_configuration.react_app_website.website_endpoint
}
