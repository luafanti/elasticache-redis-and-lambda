import {Logger} from '@aws-lambda-powertools/logger'
import {RedisClientType} from 'redis'
import {RedisCache} from '../ports'

interface RedisConfig {
  logger: Logger
  client: RedisClientType
}

const existsInCache =
  (config: RedisConfig) =>
    async (cacheKey: string | undefined): Promise<boolean> => {
      if (!cacheKey) {
        return false
      }
      const {client} = config
      const result = await client.exists(cacheKey)
      return result === 1
    }

const getFromCache =
  (config: RedisConfig) =>
    async (cacheKey: string): Promise<string | null> => {
      const {client} = config
      return await client.get(cacheKey)
    }

const saveInCache =
  (config: RedisConfig) =>
    async (cacheKey: string, apiResponse: string): Promise<void> => {
      const {client} = config
      await client.set(cacheKey, apiResponse)
    }

export const createRedisAdapter = (config: RedisConfig): RedisCache => {
  return {
    saveInCache: saveInCache(config),
    existsInCache: existsInCache(config),
    getFromCache: getFromCache(config),
  }
}
