import { createRedisAdapter } from '../../src/adapters/redis'
import { Logger } from '@aws-lambda-powertools/logger'
import { RedisClientType } from 'redis'

describe('Redis adapter tests', () => {
  const logger = new Logger()
  const redisMock: RedisClientType = jest.createMockFromModule('redis')
  const redisAdapter = createRedisAdapter({
    logger: logger,
    client: redisMock,
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("Should return 'true' if key exists in Redis", async () => {
    redisMock.exists = jest.fn().mockReturnValue(1)
    expect(await redisAdapter.existsInCache('key')).toBeTruthy()
  })

  it("Should return 'false' if key passed as 'undefined'", async () => {
    redisMock.exists = jest.fn().mockReturnValue(undefined)
    expect(await redisAdapter.existsInCache('key')).toBeFalsy()
  })

  it("Should return 'false' if key not exists in Redis", async () => {
    redisMock.exists = jest.fn().mockReturnValue(0)
    expect(await redisAdapter.existsInCache('key')).toBeFalsy()
  })
})
