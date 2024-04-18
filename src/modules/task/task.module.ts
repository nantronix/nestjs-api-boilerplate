import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { TaskApplicationEntity } from './entities/task_application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, TaskApplicationEntity])],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
