provider "aws" {
  region = var.region
}

resource "aws_s3_bucket" "react_app_bucket" {
  bucket        = var.bucket_name
  force_destroy = true
}

resource "aws_s3_bucket_website_configuration" "react_app_website" {
  bucket = aws_s3_bucket.react_app_bucket.id
  
  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_policy" "react_app_policy" {
  bucket = aws_s3_bucket.react_app_bucket.id

  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.react_app_bucket.arn}/*"
      }
    ]
  })
}