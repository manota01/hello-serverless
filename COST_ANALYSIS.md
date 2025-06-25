# Cost Analysis - HelloServerless DevOps Test

## Summary

**Total Monthly Cost: $1.11 USD** for 1 million requests per month in ap-southeast-2 (Sydney).

## Cost Breakdown

| Service         | Component          | Monthly Cost | Details                      |
| --------------- | ------------------ | ------------ | ---------------------------- |
| **Lambda**      | Function execution | $0.10        | 1M requests, 128MB, 50ms avg |
| **API Gateway** | HTTP API requests  | $1.00        | 1M requests                  |
| **CloudWatch**  | Logs & monitoring  | $0.01        | Basic logging                |
|                 | **TOTAL**          | **$1.11**    |                              |

## Serverless vs Traditional Comparison

| Architecture                | Monthly Cost | Annual Cost | Key Benefits                   |
| --------------------------- | ------------ | ----------- | ------------------------------ |
| **Serverless (current)**    | $1.11        | $13.32      | No idle costs, auto-scaling    |
| **Container (ECS Fargate)** | $140.00      | $1,680.00   | Always running, fixed capacity |
| **EC2 Instance (t3.micro)** | $8.76        | $105.12     | Server management required     |

**Serverless Savings**: 92% cheaper than containers, 87% cheaper than EC2

## Scaling Projections

| Monthly Requests | Lambda | API Gateway | CloudWatch | Total   | Cost/Request |
| ---------------- | ------ | ----------- | ---------- | ------- | ------------ |
| 1M               | $0.10  | $1.00       | $0.01      | $1.11   | $0.00111     |
| 10M              | $1.00  | $10.00      | $0.05      | $11.05  | $0.001105    |
| 100M             | $10.00 | $100.00     | $0.50      | $110.50 | $0.001105    |

## Free Tier Benefits (First 12 months)

| Service           | Free Allowance                | Estimated Savings |
| ----------------- | ----------------------------- | ----------------- |
| Lambda            | 1M requests + 400K GB-seconds | $0.10/month       |
| CloudWatch        | 10 metrics, 10K API requests  | $0.01/month       |
| **Total Savings** |                               | **$0.11/month**   |

**Effective Cost with Free Tier**: $1.00/month for first year

## Cost Optimization Features

✅ **Pay-per-use**: No charges when not processing requests  
✅ **Auto-scaling**: No over-provisioning costs  
✅ **No infrastructure**: No server, load balancer, or NAT gateway costs  
✅ **Efficient runtime**: Optimized Node.js Lambda function

## Break-even Analysis

**When serverless becomes expensive:**

- Above ~50M requests/month, consider containers
- Above ~100M requests/month, dedicated infrastructure may be cheaper
- Current implementation optimal for most web applications

---

_Pricing based on ap-southeast-2 region, updated December 2024_
