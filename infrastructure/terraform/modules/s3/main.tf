resource "aws_s3_bucket" "s3_bucket" {
  bucket = var.bucket_name
}

data "aws_caller_identity" "current" {}

data "aws_iam_policy_document" "s3_policy" {
  version = "2012-10-17"

  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.s3_bucket.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = ["arn:aws:cloudfront::${data.aws_caller_identity.current.account_id}:distribution/${var.cloudfront_distribution_id}"]
    }
  }
}

resource "aws_s3_bucket_policy" "login_spa_bucket_policy" {
  bucket = aws_s3_bucket.s3_bucket.id
  policy = data.aws_iam_policy_document.s3_policy.json
}