import { Module} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { WeixinUserEntity } from './entities/weixin_user.entity';
import { UserGroupEntity } from './entities/user_group.entity';
import { DouyinUserEntity } from './entities/douyin_user.entity';
import { AccountLogEntity } from './entities/account_log.entity';
import { WechatModule } from '../wechat/wechat.module';
import { DouyinModule } from '../douyin/douyin.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    WechatModule,
    CacheModule.register(),
    DouyinModule,
    TypeOrmModule.forFeature([
      UserEntity,
      WeixinUserEntity,
      AccountLogEntity,
      DouyinUserEntity,
      UserGroupEntity,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
