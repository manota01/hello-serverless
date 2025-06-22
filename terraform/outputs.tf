output "application_url" {
  description = "API Gateway endpoint URL"
  value       = aws_apigatewayv2_api.main.api_endpoint
}

output "hello_endpoint" {
  description = "Hello endpoint URL (requires X-API-Key header)"
  value       = "${aws_apigatewayv2_api.main.api_endpoint}/hello"
}

output "health_endpoint" {
  description = "Health endpoint URL (public)"
  value       = "${aws_apigatewayv2_api.main.api_endpoint}/health"
}

output "api_key" {
  description = "API key for accessing protected endpoints"
  value       = random_password.api_key.result
  sensitive   = true
}

output "security_summary" {
  description = "Security configuration summary"
  value = {
    waf_enabled = "Yes - blocks common attacks and rate limits"
    api_key_protection = "/hello endpoint requires X-API-Key header"
    rate_limiting = "2000 requests per 5 minutes per IP"
    throttling = "100 requests per second"
    security_headers = "Applied to all responses"
  }
}