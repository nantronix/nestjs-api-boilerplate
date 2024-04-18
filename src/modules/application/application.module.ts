import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationEntity } from './entities/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApplicationEntity])],
  controllers: [ApplicationController],
  providers: [ApplicationService]
})
export class ApplicationModule {}
