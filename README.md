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

Flow is very simply... `ProxyLambda` first checks if response from External API exists in cache. As a cache key in this simple example, I just use the full request path also with query params. In complex API I can recommend a more advanced strategy for key generation. If response object exists in Redis cache, Lambda returns it directly. Otherwise, Lambda calls External API as before but additionally saves this response to the Redis cache. Thanks to this, a subsequent request to `ProxyLambda` for this same resource, will be returned from cache instead calling External API.

Basically the two diagrams below should explain it all

<p align="center">
  <img alt="API caching with Redis -  component diagram" src="images/API%20caching%20with%20Redis%20&%20AWS%20Lambda%20-%20%20component%20diagram.png" width="400" height="300">
</p>

<p align="center">
  <img alt="API caching with Redis -  sequence diagram" src="images/API%20caching%20with%20Redis%20&%20AWS%20Lambda%20-%20%20sequence%20diagram.png" width="1000" height="500">
</p>


There is still the question about invalidating records in cache. Here the strategy must fit requirements. In this demo, objects in the cache are eternal. One of solution would be to hardcode expiration time on save (`redis.setEx(cacheKey, 86400, apiResponse`). A more elegant way would be to create dedicated invalidation Lambda, which will remove objects from the cache when receiving an event that in External API some resource has been removed or modified.
