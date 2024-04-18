import { Module } from '@nestjs/common';
import { MicroService } from './micro.service';
import { MicroController } from './micro.controller';

@Module({
  controllers: [MicroController],
  providers: [MicroService]
})
export class MicroModule {}
