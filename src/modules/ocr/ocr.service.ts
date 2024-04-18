import { Injectable } from '@nestjs/common';
import { CreateOcrDto } from './dto/create-ocr.dto';
import { UpdateOcrDto } from './dto/update-ocr.dto';
import Client, * as $ocr_api from "@alicloud/ocr-api20210707";
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import Util, * as $Util from '@alicloud/tea-util';
import * as $tea from '@alicloud/tea-typescript';

@Injectable()
export class OcrService {
    private client: any;
    private handlers: any;
   constructor() {
       let config = new $OpenApi.Config({
           accessKeyId: process.env.OCR_ACCESS_KEY_ID,
           accessKeySecret: process.env.OCR_ACCESS_KEY_SECRET,
       });
       // 访问的域名
       config.endpoint = "ocr-api.cn-hangzhou.aliyuncs.com";
       this.client = new Client(config);
       this.handlers = {
           'table':this.createRecognizeTableOcr,
       }



  }

  create(typeName:string,url:string){
      const handler = this.handlers[typeName];
      if(handler){
          return handler.apply(this,[url]);
      } else {
          throw new Error('不支持的类型');
      }
  }

  //表格识别
  createRecognizeTableOcr(url:string){
      try{
          
      const request = new $ocr_api.RecognizeTableOcrRequest({url:url});
      const response = this.client.recognizeTableOcr(request);
      console.log(response);
      return response;
      }catch(e){
          console.log(e.message);
          return {error:1,errmsg:e.message};
      }
  }
  

}
