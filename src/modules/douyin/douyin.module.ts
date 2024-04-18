import { Module} from '@nestjs/common';
import { DouyinService } from './douyin.service';
import { DouyinController } from './douyin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
//import { TaskOrderEntity } from '../tasks/entities/task_order.entity';

@Module({
  imports: [HttpModule, CacheModule.register(), TypeOrmModule.forFeature([])],
  controllers: [DouyinController],
  providers: [DouyinService],
  exports: [DouyinService],
})
export class DouyinModule {}
