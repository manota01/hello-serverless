#!/bin/bash

set -e

echo "🗑️  HelloHexa DevOps Test - Docker Cleanup"
echo "=========================================="

# Check if AWS credentials are configured
if [ ! -f ~/.aws/credentials ] && [ ! -f ~/.aws/config ]; then
    echo "❌ AWS credentials not found. Please run 'aws configure' first."
    exit 1
fi

# Check if user wants to proceed
read -p "⚠️  This will destroy ALL resources. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted by user"
    exit 1
fi

# Build the Docker image if not exists
echo "📦 Ensuring Docker image is built..."
docker-compose build

# Run destroy in container
echo "🗑️  Running destroy in Docker container..."
docker-compose run --rm devops bash -c "
    echo '🔧 Verifying tools...'
    aws --version
    terraform --version
    
    echo '🏗️  Initializing Terraform...'
    cd terraform
    terraform init
    
    echo '📋 Planning destroy...'
    terraform plan -destroy
    
    echo '🗑️  Destroying infrastructure...'
    terraform destroy -auto-approve
    
    echo '🧹 Cleaning up local files...'
    rm -f lambda.zip
    rm -f terraform.tfstate*
    rm -rf .terraform/
    
    echo '✅ Cleanup completed!'
"

echo "🎉 Docker cleanup completed successfully!"
echo "ℹ️  All AWS resources have been destroyed" 