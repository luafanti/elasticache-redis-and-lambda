# ElastiCache Redis & TypeScript Lambda - API caching demo

This repository contains an example of using in serverless application Redis to cache external API responses. 

## Installation

The demo can be installed using the CloudFormation template. The stack created with the default parameters will provision the following resources:

- VPC with public & private subnet
- NAT Gateway
- ElastiCache Redis
- TypeScript Lambda & Http ApiGateway

⚠️ Please note that your stack includes components (NAT & Redis) that will incur hourly costs even if you have AWS Free Tier.

```bash
npm install 
sam build
sam deploy 
```

To remove whole stack

```bash
sam delete
```

## How it works? 
TBC...
