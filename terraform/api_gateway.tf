# Simple HTTP API Gateway
resource "aws_apigatewayv2_api" "main" {
  name          = "${local.name_prefix}-api"
  protocol_type = "HTTP"
  description   = "HelloServerless DevOps Test API"

  cors_configuration {
    allow_methods = ["GET", "OPTIONS"]
    allow_origins = var.cors_allowed_origins
  }

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-api-gateway"
  })
}

# Lambda integration
resource "aws_apigatewayv2_integration" "lambda" {
  api_id           = aws_apigatewayv2_api.main.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.app.invoke_arn
  
  integration_method      = "POST"
  payload_format_version  = "2.0"
}

# Route for /hello endpoint
resource "aws_apigatewayv2_route" "hello" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /hello"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# Default route (catch all)
resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# API Gateway stage (using $default for clean URLs)
resource "aws_apigatewayv2_stage" "main" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = "$default"
  auto_deploy = true

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-api-stage"
  })
} 