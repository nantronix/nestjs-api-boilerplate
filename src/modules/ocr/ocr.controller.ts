import { Controller, Get, Post, Body, Patch, Param, Delete,Request, UseGuards } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { CreateOcrDto } from './dto/create-ocr.dto';
import { UpdateOcrDto } from './dto/update-ocr.dto';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  //url to ocr
  @Post('create')
  create(@Request() req) {
    return this.ocrService.create('table',req.body['url']);
  }


}
