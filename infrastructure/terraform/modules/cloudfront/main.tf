resource "aws_cloudfront_origin_access_control" "oac" {
    name         = "oac"
    signing_behavior = "always"
    signing_protocol = "sigv4"
    origin_access_control_origin_type = "s3"
}

resource "aws_cloudfront_distribution" "cdn_distribution" {
    
    origin {
      domain_name = var.cloudfront_origin_domain_name
      origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
      origin_id = var.cloudfront_origin_id
    }

    enabled = true
    is_ipv6_enabled = true

    viewer_certificate {
      cloudfront_default_certificate = true
    }

    default_cache_behavior {
        target_origin_id       = var.cloudfront_origin_id
        viewer_protocol_policy = "allow-all"
        allowed_methods = ["GET", "HEAD", "OPTIONS"]
        cached_methods = ["GET", "HEAD"]

        forwarded_values {
            query_string = false
            cookies {
                forward = "none"
            }
            headers = []
        }
    }

    restrictions {
        geo_restriction {
            restriction_type = "none"
        }
    }

     custom_error_response {
        error_code            = 403
        response_code         = 200           
        response_page_path    = "/index.html" 
        error_caching_min_ttl = 0             
    }
}