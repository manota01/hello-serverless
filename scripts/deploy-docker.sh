#!/bin/bash

set -e

echo "HelloServerless DevOps Test - Docker Deployment"
echo "============================================="

# Check if AWS credentials are configured
if [ ! -f ~/.aws/credentials ] && [ ! -f ~/.aws/config ]; then
    echo "❌ AWS credentials not found. Please run 'aws configure' first."
    exit 1
fi

# Build the Docker image
echo "📦 Building Docker image..."
docker-compose build

# Run deployment in container
echo "🚀 Running deployment in Docker container..."
docker-compose run --rm devops bash -c "
    echo '🔧 Verifying tools...'
    aws --version
    terraform --version
    node --version
    
    echo '🏗️  Initializing Terraform...'
    cd terraform
    terraform init
    
    echo '📋 Planning deployment...'
    terraform plan
    
    echo '🚀 Applying infrastructure...'
    terraform apply -auto-approve
    
    echo '📤 Packaging Lambda function...'
    cd /workspace
    zip -r terraform/lambda.zip src/ -x '*.DS_Store'
    
    echo '♻️  Updating Lambda with new code...'
    cd terraform
    terraform apply -auto-approve
    
    echo '✅ Deployment completed!'
    echo '📋 Getting outputs...'
    terraform output
"

echo "🎉 Docker deployment completed successfully!"
echo "ℹ️  Check the outputs above for your API URL" 