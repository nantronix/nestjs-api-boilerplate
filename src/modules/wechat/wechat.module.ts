import { Module} from '@nestjs/common';
import { WechatService } from './wechat.service';
import { WechatController } from './wechat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [HttpModule,TypeOrmModule.forFeature([]),CacheModule.register()],
  controllers: [WechatController],
  providers: [WechatService],
  exports: [WechatService],
})
export class WechatModule {}
