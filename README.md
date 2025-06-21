# hellohexa

This project demonstrates a basic serverless web service on AWS.

## Overview
- **Endpoint**: `GET /hello`
- **Response**: `200 OK` with body `OK`
- **Architecture**: API Gateway (REST API) in front of a Lambda function written in Node.js.
- **Security**: The API requires an API key via API Gateway Usage Plan.

## Getting Started

1. Install [Terraform](https://www.terraform.io/downloads).
2. Configure AWS credentials (for example via `aws configure`).
3. Initialize and deploy the stack:
   ```bash
   cd terraform
   terraform init
   terraform apply
   ```
   The output will display the invoke URL and generated API key.

4. Test the API:
   ```bash
   curl -H "x-api-key: <value from output>" https://<invoke_url>/hello
   ```

## Clean Up
Run `terraform destroy` inside the `terraform` directory to remove resources.

## Diagram
See `design_diagram.txt` for a simple architecture diagram.

## Cost Estimate (1M requests / month)
- **API Gateway REST API**: ~\$3.50 per million requests.
- **AWS Lambda** (128MB, 100ms per invocation): ~\$2.33 per million requests.
- **Total**: ~\$5.83 per month for 1M requests (excluding free tier and data transfer).

These prices are based on AWS us-east-1 rates at the time of writing.
