# Basic logging for Lambda function
resource "aws_cloudwatch_log_group" "lambda_logs" {
  name              = "/aws/lambda/${local.name_prefix}-app"
  retention_in_days = 7

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-lambda-logs"
  })
}