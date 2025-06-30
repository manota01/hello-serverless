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

# Optional custom domain for the API Gateway
resource "aws_apigatewayv2_domain_name" "custom" {
  count = var.api_domain_name != "" && var.api_domain_certificate_arn != "" ? 1 : 0

  domain_name = var.api_domain_name

  domain_name_configuration {
    certificate_arn = var.api_domain_certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-api-domain"
  })
}

# Map the custom domain to the default stage
resource "aws_apigatewayv2_api_mapping" "custom" {
  count       = var.api_domain_name != "" && var.api_domain_certificate_arn != "" ? 1 : 0
  api_id      = aws_apigatewayv2_api.main.id
  domain_name = aws_apigatewayv2_domain_name.custom[0].id
  stage       = aws_apigatewayv2_stage.main.id
}
