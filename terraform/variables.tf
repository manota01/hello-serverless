variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "ap-southeast-2"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "helloserverless-devops-test"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "HelloServerless DevOps Test"
    Environment = "dev"
    Terraform   = "true"
  }
}

variable "cors_allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}

variable "app_version" {
  description = "Application version"
  type        = string
  default     = "1.1.0"
}

variable "rate_limit" {
  description = "Rate limit for the API"
  type        = string
  default     = "100 req/s"
} 