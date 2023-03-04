import {APIGatewayProxyEventV2, APIGatewayProxyResult} from 'aws-lambda';
import {createRedisAdapter} from "../adapters/redis";
import {createClient, RedisClientType} from "redis";
import {Logger} from "@aws-lambda-powertools/logger";
import axios from "axios";

const REDIS_URL = process.env.REDIS_URL || ''
const REDIS_USERNAME = process.env.REDIS_USERNAME || ''
const REDIS_AUTH_TOKEN = process.env.REDIS_AUTH_TOKEN || ''
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL

const logger = new Logger()

const redisClient: RedisClientType = createClient({
  url: REDIS_URL,
  password: REDIS_AUTH_TOKEN,
  username: REDIS_USERNAME,
})

const httpClient = axios.create({
  baseURL: EXTERNAL_API_URL,
  headers: {
    accept: 'application/json',
  }
})

redisClient.on('connect', () => logger.info(`Redis connection established`))

const extractCacheKey = (event: APIGatewayProxyEventV2): string => {
  const requestPath = event.pathParameters?.proxy ?? ''
  const requestParams = event.rawQueryString
  return requestParams ? `${requestPath}?${requestParams}` : requestPath
}

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResult> => {
  const redisAdapter = createRedisAdapter({client: redisClient, logger: logger})
  await redisClient.connect()

  const requestPath = extractCacheKey(event)
  const cachedResponse = await redisAdapter.getFromCache(requestPath)
  if (cachedResponse) {
    logger.info(`Response exist in the cache for key: ${requestPath}`)
    await redisClient.disconnect()
    return {
      statusCode: 200,
      body: cachedResponse
    }
  }
  logger.info(`Response not exist in the cache. Calling external API: ${httpClient.defaults.baseURL}/${requestPath}`)
  const apiResponse = await httpClient.get(requestPath)
  const responseData = JSON.stringify(apiResponse.data)
  await redisAdapter.saveInCache(requestPath, responseData)
  logger.info(`External API response has been cached under key: ${requestPath}`)
  await redisClient.disconnect()
  return {
    statusCode: 200,
    body: responseData
  };
}
