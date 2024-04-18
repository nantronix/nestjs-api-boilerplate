import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
  Version,
} from '@nestjs/common';

import { WorkflowService } from './workflow.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  //获取所有可用的工作流
  @UseGuards(JwtAuthGuard)
  @Get('get_workflows')
  getWorkflows(@Request() req) {
    return this.workflowService.getWorkflows(req.user);
  }
 
}
