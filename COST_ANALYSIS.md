# Cost Analysis - HelloHexa DevOps Test

## Summary
**Total Monthly Cost: $6.71 USD** for 1 million requests per month in ap-southeast-2 (Sydney).

## Cost Breakdown

| Service | Component | Monthly Cost | Details |
|---------|-----------|--------------|---------|
| **Lambda** | Function execution | $0.10 | 1M requests, 128MB, 50ms avg |
| **API Gateway** | HTTP API requests | $1.00 | 1M requests |
| **WAF** | Security protection | $5.60 | Web ACL + 3 rules + processing |
| **Parameter Store** | API key storage | $0.00 | Free tier |
| **CloudWatch** | Logs & monitoring | $0.01 | 7-day retention |
| | **TOTAL** | **$6.71** | |

## Security vs Basic Comparison

| Architecture | Lambda | API Gateway | WAF | Total |
|--------------|--------|-------------|-----|-------|
| **Basic (no security)** | $0.10 | $1.00 | $0.00 | $1.11 |
| **Secured (current)** | $0.10 | $1.00 | $5.60 | $6.71 |
| **Security premium** | - | - | +$5.60 | +$5.60 |

## Scaling Projections

| Monthly Requests | Total Cost | Cost per Request |
|------------------|------------|------------------|
| 1M | $6.71 | $0.00671 |
| 10M | $22.00 | $0.0022 |
| 100M | $175.00 | $0.00175 |

## Free Tier Savings (First 12 months)

| Service | Free Allowance | Estimated Savings |
|---------|----------------|-------------------|
| Lambda | 1M requests + 400K GB-seconds | $0.10/month |
| Parameter Store | 10K parameters + API calls | $0.00/month |
| CloudWatch | 10 metrics, 10K API requests | $0.01/month |
| **Total Savings** | | **$0.11/month** |

---
*Pricing based on ap-southeast-2 region, December 2024* 