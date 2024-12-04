output "cloudfront_oac_id" {
  value       = aws_cloudfront_origin_access_control.oac.id
  description = "The ID of the CloudFront Origin Access Control (OAC)"
}

output "cloudfront_oac_name" {
  value       = aws_cloudfront_origin_access_control.oac.name
  description = "The name of the CloudFront Origin Access Control (OAC)"
}

output "cloudfront_distribution_id" {
  value       = aws_cloudfront_distribution.cdn_distribution.id
  description = "The id of the cloud front distribution"
}
