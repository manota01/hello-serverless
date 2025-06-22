output "application_url" {
  description = "API Gateway endpoint URL"
  value       = aws_apigatewayv2_api.main.api_endpoint
}

output "hello_endpoint" {
  description = "Hello endpoint URL (public)"
  value       = "${aws_apigatewayv2_api.main.api_endpoint}/hello"
}

output "health_endpoint" {
  description = "Health endpoint URL (public)"
  value       = "${aws_apigatewayv2_api.main.api_endpoint}/health"
}

output "application_summary" {
  description = "Application deployment summary"
  value = {
    architecture = "Serverless (Lambda + API Gateway)"
    endpoints = {
      hello = "GET /hello → Returns 'OK'"
      health = "GET /health → Returns health status"
      root = "GET / → Returns API information"
    }
    cost_estimate = "$1.11/month for 1M requests"
    region = data.aws_region.current.name
  }
}