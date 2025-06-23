# Package Lambda function code
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../src"
  output_path = "${path.module}/lambda.zip"
}

# IAM role for Lambda execution
resource "aws_iam_role" "lambda_role" {
  name = "${local.name_prefix}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-lambda-role"
  })
}

# Attach basic execution policy
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda_role.name
}

# Main Lambda function
resource "aws_lambda_function" "app" {
  filename      = data.archive_file.lambda_zip.output_path
  function_name = "${local.name_prefix}-app"
  role          = aws_iam_role.lambda_role.arn
  handler       = "lambda.handler"

  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  runtime = "nodejs18.x"
  timeout = 10

  environment {
    variables = {
      APP_VERSION  = var.app_version
      ENVIRONMENT  = var.environment
      CORS_ORIGIN  = join(",", var.cors_allowed_origins)
      RATE_LIMIT   = var.rate_limit
    }
  }

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-lambda"
  })
}

# Lambda function permission for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.app.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
} 