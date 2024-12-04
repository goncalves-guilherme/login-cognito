output "s3_bucket_name" {
  value       = aws_s3_bucket.s3_bucket.bucket
  description = "The name of the S3 bucket"
}

output "s3_bucket_arn" {
  value       = aws_s3_bucket.s3_bucket.arn
  description = "The ARN of the S3 bucket"
}

output "s3_bucket_policy" {
  value       = data.aws_iam_policy_document.s3_policy.json
  description = "The S3 bucket policy that allows CloudFront access"
}

output "cloudfront_origin_domain_name" {
  value       = aws_s3_bucket.s3_bucket.bucket_regional_domain_name
  description = "The domain name of the S3 bucket or other origin"
}

