# Package Lambda function code
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../src/lambda.js"
  output_path = "${path.module}/lambda.zip"
}

# IAM role for Lambda execution
resource "aws_iam_role" "lambda_role" {
  name_prefix = "${local.name_prefix}-lambda-"

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
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda function
resource "aws_lambda_function" "app" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "${local.name_prefix}-app"
  role            = aws_iam_role.lambda_role.arn
  handler         = "lambda.handler"
  runtime         = "nodejs18.x"
  timeout         = 30
  memory_size     = 128
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      NODE_ENV = "production"
      VERSION  = "1.0.0"
    }
  }

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-lambda"
  })

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic,
    aws_cloudwatch_log_group.lambda_logs
  ]
}

# Lambda function permission for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.app.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
} 