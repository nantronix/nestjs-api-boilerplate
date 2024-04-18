import { BadRequestException, Injectable,HttpStatus,UnauthorizedException  } from '@nestjs/common';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,LessThan,MoreThan,In} from 'typeorm';
import { WorkflowEntity } from './entities/workflow.entity';
import { WorkflowApplicationEntity } from './entities/workflow_application.entity';

@Injectable()
export class WorkflowService {
    constructor(
        @InjectRepository(WorkflowEntity)
        private readonly workflowRepository: Repository<WorkflowEntity>,
        @InjectRepository(WorkflowApplicationEntity)
        private readonly workflowApplicationRepository: Repository<WorkflowApplicationEntity>
    ){}

    //获取所有可用的工作流
    async getWorkflows(user:any){
        const workflows = await this.workflowRepository.find({where:{status:1}});

        return {error:0,data:workflows};
    }


}
