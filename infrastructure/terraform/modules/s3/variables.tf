variable "bucket_name" {
  description = "The name of the bucket to be created."
  type        = string
}

variable "cloudfront_oac_id" {
  description = "The ID of the CloudFront Origin Access Control (OAC)"
  type        = string
}

variable "cloudfront_distribution_id" {
  description = "The id of the cloud front distribution"
  type        = string
}
