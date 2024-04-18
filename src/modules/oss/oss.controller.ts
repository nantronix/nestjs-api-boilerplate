import {Body, Controller, Delete, Post, Request, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import { OssService } from './oss.service';
import {FileInterceptor} from "@nestjs/platform-express";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";

@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  /*上传单个文件*/
  @UseGuards(JwtAuthGuard)
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    return await this.ossService.uploadFile(file);
  }

  /*删除单个文件*/
  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@Body('path') path: string) {
    return await this.ossService.remove(path);
  }

}
