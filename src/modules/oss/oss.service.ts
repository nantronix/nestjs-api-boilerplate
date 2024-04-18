import {BadRequestException, Injectable} from '@nestjs/common';
import {Buffer} from "buffer";
import { ConfigService} from '@nestjs/config';
const OSS = require('ali-oss');

@Injectable()
export class OssService {
    private client: any;
    constructor(
         private readonly configService: ConfigService
    ) {
        this.client = new OSS({
            region: this.configService.get<string>('oss.region'),
            accessKeyId: this.configService.get<string>('oss.accessKeyId'),
            accessKeySecret: this.configService.get<string>('oss.accessKeySecret'),
            bucket: this.configService.get<string>('oss.bucket'),
            secure:this.configService.get<string>('oss.secure'),
            us_west_region:this.configService.get<string>('oss.us_west_region'),
            use_west_endpoint:this.configService.get<string>('oss.use_west_endpoint'),
            use_west_bucket:this.configService.get<string>('oss.use_west_bucket'),
        });
    }

    /*async uploadFile(file) {
        try {
            let res = null, url = '';
            let local_file
            if(file.indexOf('/data/projects/aishow') == -1){
             local_file = `/data/projects/aishow/photos/${file}`;
            }else{
                local_file = file
            }
                res = await this.client.put(file,local_file,{
                    'x-oss-object-acl': 'public-read',
                });
                if (res.res.status != 200){
                    return {
                        error: 1,
                        data:'',
                        msg: res.res.statusMessage,
                    }
                }
                url = res.url;
            return {
                error: 0,
                errmsg:'OK',
                data: url,
            };
        }catch (e) {
            console.log(e);
            return {error:1,errmsg:e.message,data:''};
        }
    }*/
    async uploadFile(file) {
        try {
             let res = null, url = '';
            let local_file
            if(file.indexOf('/data/projects/aishow') == -1){
             local_file = `/data/projects/aishow/photos/${file}`;
            }else{
                local_file = file
            }
            //const route = '/file/'+ new Date().getTime() +'_'+ file.originalname;
            if (file.size > 0.5 * 1024 * 1024){
                let checkpoint: any = 0;
                //断点连续上传
                for (let i = 0; i < 3; i++) {
                    try {
                        res = await this.client.multipartUpload(file, local_file, {
                            checkpoint,
                             partSize: 1000 * 1024,//设置分片大小
                             timeout: 120000,//设置超时时间
                            async progress(percentage, cpt) {
                                checkpoint = cpt;
                            },
                            'x-oss-object-acl': 'public-read',
                        });
                        break;
                    } catch (e) {
                        throw new BadRequestException(e.toString());
                    }
                }
                if (res.res.status != 200){
                    return {
                        error: 1,
                        msg: res.res.statusMessage,
                    }
                }
                url = 'https://'+ this.configService.get<string>('oss.bucket')+'.'+this.configService.get<string>('oss.endpoint')+ res.name;
            }else {
                res = await this.client.put(file, local_file,{
                    'x-oss-object-acl': 'public-read',
                     timeout: 120000
                });
                if (res.res.status != 200){
                    return {
                        error: 1,
                        msg: res.res.statusMessage,
                    }
                }
                url = res.url;
            }
            return {
                error: 0,
                data: url,
            };
        }catch (e) {
            console.log(e);
            return e;
        }
    }

    async remove(path:string){
        if (path){
            path = path.replace('https://'+ this.configService.get<string>('oss.bucket')+'.'+this.configService.get<string>('oss.endpoint'),'');
            await this.client.delete(path);
            return {
                error: 0,
                errmsg: '成功',
                data:''
            };
        }else {
            return {
                error: 1,
                errmsg: '请选择文件',
                data:''
            }
        }
    }

}
