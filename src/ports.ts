export interface RedisCache {
  getFromCache(cacheKey: string): Promise<string | null>

  existsInCache(cacheKey: string | undefined): Promise<boolean>

  saveInCache(cacheKey: string, apiResponse: string): Promise<void>
}
