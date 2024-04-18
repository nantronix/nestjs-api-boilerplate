import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowEntity } from './entities/workflow.entity';
import { WorkflowApplicationEntity } from './entities/workflow_application.entity';


@Module({
  imports: [TypeOrmModule.forFeature([WorkflowEntity, WorkflowApplicationEntity])],
  controllers: [WorkflowController],
  providers: [WorkflowService]
})
export class WorkflowModule {}
