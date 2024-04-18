import {
  Injectable,
} from '@nestjs/common';

import {CacheOptionsFactory, CacheModuleOptions} from '@nestjs/cache-manager';
@Injectable()
export class CacheService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    return {
      ttl: 5, // seconds
      max: 10, // maximum number of items in cache
    };
  }
}
