variable "cloudfront_origin_domain_name" {
  description = "The domain name of the S3 bucket or other origin"
  type        = string
}

variable "cloudfront_origin_id" {
  description = "A unique identifier for the origin"
  type        = string
}