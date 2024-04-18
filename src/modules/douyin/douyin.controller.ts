import { Controller, Get, Post, Body, Patch, Param, Delete,Res } from '@nestjs/common';
import { DouyinService } from './douyin.service';

@Controller('douyin')
export class DouyinController {
  constructor(private readonly douyinService: DouyinService) {}


  @Get('check_test')
  getTasks() {
    return this.douyinService.checkTest();
  }
  
}
