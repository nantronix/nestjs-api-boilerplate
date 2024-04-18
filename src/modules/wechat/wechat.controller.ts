import { Controller, Get, Post, Body, Patch, Param, Delete,Res } from '@nestjs/common';
import { WechatService } from './wechat.service';
import { CreateWechatDto } from './dto/create-wechat.dto';
import { UpdateWechatDto } from './dto/update-wechat.dto';

@Controller('wechat')
export class WechatController {
  constructor(private readonly wechatService: WechatService) {}

  @Post()
  create(@Body() createWechatDto: CreateWechatDto) {
    return this.wechatService.create(createWechatDto);
  }

  @Get()
  findAll(@Res() res) {
    const resData = {error:0,data:'OK'}
    console.log(resData)
      if(resData['error'] == 0){
         res.status(200).send();
    }else{
        res.status(401).json(resData['data'])
    }
    //return JSON.stringify(resData)
    //return this.wechatService.getPlatformCertificates();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wechatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWechatDto: UpdateWechatDto) {
    return this.wechatService.update(+id, updateWechatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wechatService.remove(+id);
  }
}
