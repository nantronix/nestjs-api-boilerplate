import { Injectable,Inject} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {Cache} from 'cache-manager'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,LessThan,MoreThan,In} from 'typeorm';
import { CreateWechatDto } from './dto/create-wechat.dto';
import { UpdateWechatDto } from './dto/update-wechat.dto';
import {AxiosResponse,AxiosError}from 'axios';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigService} from '@nestjs/config';
import { createNonceStr } from '../../utils';
import * as crypto from 'crypto';
import axios from 'axios';
import {readFileSync } from 'fs'
import {pki} from 'node-forge';
import {
  CallbackResource,
  CertificateResult,
  MiniProgramPaymentParameters,
  RefundParameters,
  RefundResult,
  RequireOnlyOne,
  Trade,
  TransactionOrder,
} from './types';
import {
  AccessTokenResult,
  ActivityIdResult,
  MessageTemplateListResult,
  PubTemplateKeyWords,
  PubTemplateTitleListResult,
  RidInfo,
  SchemeInfo,
  SchemeQuota,
  UrlLinkResult,
} from './miniprogram.result';
import { DefaultRequestResult, ParamCreateQRCode, PhoneNumberResult, SessionResult } from './interfaces';



@Injectable()
export class WechatService {
    private readonly appId:string
    private readonly appSecret:string
    private readonly mchId:string
    private readonly serialNo:string
    private readonly privateKey:any
    private readonly publicKey:any
    private readonly apiKey:any
    
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
         @Inject(CACHE_MANAGER)
         private cacheManager:Cache


    ) { 
        this.appId = 'wxdb368112fae3ff5d'
        this.appSecret = 'e2bd6da69a015fcb889b4679da17e1f0'
        this.mchId = '1231086502'
        this.serialNo = '4144B232C9025BDAE8CFA1BC3E29C4AC74D7AE1D'
        //读取本地证书,从当前项目根目录读取
        const localPath = process.cwd()
        this.privateKey = readFileSync(localPath+'/cert/apiclient_key.pem') //私钥
        this.publicKey = readFileSync(localPath+'/cert/platform_cert.pem') //公钥
        //this.privateKey = readFileSync('/data/projects/aishow/cert/apiclient_key.pem') //私钥
        //this.publicKey = readFileSync('/data/projects/aishow/cert/platform_cert.pem') //公钥
        this.apiKey =  'e7a2a02ed4e883c96a1362c1023424d7'  //v3 key
    }


    /**
   * 获取接口调用凭据
   * 
   * 获取小程序全局唯一后台接口调用凭据，token有效期为7200s，开发者需要进行妥善保存。
   * 
   * @param appId 
   * @param secret 
   * @returns 
   */
  public async getAccessToken () {
    let appId = this.appId;
    let secret = this.appSecret;
    let access_token:string = await this.cacheManager.get('mw_access_token');
    if(access_token){
        return access_token
    }
    const url = 'https://api.weixin.qq.com/cgi-bin/token';
    // eslint-disable-next-line camelcase
    const tokenRes =  await axios.get<AccessTokenResult>(url, { params: { grant_type: 'client_credential', appid: appId, secret } });
    if(tokenRes.data['access_token']){
        await this.cacheManager.set('mw_access_token',tokenRes.data['access_token'],  6000);
        access_token = tokenRes.data['access_token']
        return access_token
          }
        return ''

  }



    //
    async code2Session(code:string): Promise<any[]> {
        const { data } = await firstValueFrom(
            this.httpService.get<any[]>(`https://api.weixin.qq.com/sns/jscode2session?appid=${this.configService.get<string>('mwechat.appid')}&secret=${this.configService.get<string>('mwechat.appsecret')}&js_code=${code}&grant_type=authorization_code`).pipe(
                catchError((error: AxiosError) => {
                    console.log(error.response.data);
                    throw 'An error happened!';
                }),
            ),
        );
        return data;
    }

   /**
   * 获取手机号
   * @param {string} accessToken 小程序调用token，第三方可通过使用authorizer_access_token代商家进行调用
   * @param {string} code 手机号获取凭证，小程序端获取
   * @returns 
   * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-info/phone-number/getPhoneNumber.html
   * @link https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html
   */
  public async getPhoneNumber (code: string, accessToken: string) {
    const url = `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${accessToken}`;
    return await axios.post<PhoneNumberResult>(url, { code });
  }


    /**
   * 获取平台证书列表
   * @param mchId 
   * @param serialNo 
   * @param privateKey 
   * @param apiKey 
   * @returns 
   * @link https://pay.weixin.qq.com/wiki/doc/apiv3/apis/wechatpay5_1.shtml
   */
  async getPlatformCertificates () {
    const certs: { sn: string, publicKey: string}[] = [];
    const nonceStr = createNonceStr();
    const timestamp = Math.floor(Date.now() / 1000);
    let url = '/v3/certificates';
    const signature = this.generateSignature('GET', url, timestamp, nonceStr, this.privateKey);
    url = 'https://api.mch.weixin.qq.com' + url;
    const ret = await axios.get<{ data: CertificateResult[] }>(url, { headers: this.generateHeader(this.mchId, nonceStr, timestamp, this.serialNo, signature) });
    // console.log('ret.data.data =', ret.data.data);
    if (ret && ret.status === 200 && ret.data) {
      const certificates = ret.data.data;
      for (const cert of certificates) {
        const publicKey = this.decryptCipherText(this.apiKey, cert.encrypt_certificate.ciphertext, cert.encrypt_certificate.associated_data, cert.encrypt_certificate.nonce) as string;
        console.log(publicKey)
        const sn = this.getCertificateSn(publicKey);
        certs.push({ sn, publicKey });
      }
    }
    return certs;
  }

   /**
   * JSAPI下单
   * @param order 下单信息
   * @param serialNo 私钥序列号
   * @param privateKey 私钥
   * @returns 
   * @link https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_5_1.shtml
   */
  async jsapi (order) {
    const nonceStr = createNonceStr();
    const timestamp = Math.floor(Date.now() / 1000);
    const privateKey = this.privateKey
    const serialNo = this.serialNo
    let url = '/v3/pay/transactions/jsapi';
    let postData = {appid:this.appId,mchid:this.mchId,...order}
    const signature = this.generateSignature('POST', url, timestamp, nonceStr, privateKey, postData);
    url = 'https://api.mch.weixin.qq.com' + url;
    return axios.post<{ prepay_id: string }>(url, postData, {
      headers: this.generateHeader(postData.mchid, nonceStr, timestamp, serialNo, signature),
    });
    //return await this.sendData(postData,url)
  }

  async sendData(postData,url):Promise<any>{
    try{
      const { data } = await firstValueFrom(
      this.httpService.post<any>(url,postData,{ headers: { 'Content-Type': 'application/json' }}).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

       return data
     }catch(err){
        return {error:1,errmsg:err.message,data:''}

      }

     }

 /**
   * 构建请求签名
   * @param mchId 
   * @param nonceStr 
   * @param timestamp 
   * @param serialNo 
   * @param signature 
   * @returns 
   */
  private generateHeader (mchId: string, nonceStr: string, timestamp: number, serialNo: string, signature: string) {
    return {
      'Authorization': `WECHATPAY2-SHA256-RSA2048 mchid="${mchId}",nonce_str="${nonceStr}",signature="${signature}",timestamp="${timestamp}",serial_no="${serialNo}"`,
    };
  }

  /**
   * 生成请求签名串
   * @param method 
   * @param url 
   * @param timestamp 
   * @param nonceStr 
   * @param privateKey 
   * @param body 
   * @returns 
   */
  private generateSignature (method: 'GET' | 'POST', url: string, timestamp: number, nonceStr: string, privateKey: Buffer | string, body?: object): string {
    let message = `${method}\n${url}\n${timestamp}\n${nonceStr}\n\n`;

    if (method === 'POST') {
      if (!body) {
        body = {};
      }
      message = `${method}\n${url}\n${timestamp}\n${nonceStr}\n${typeof body === 'string' ? body : JSON.stringify(body)}\n`;
    }
    return crypto.createSign('sha256WithRSAEncryption').update(message).sign(privateKey, 'base64');
  }


   /**
   * 构造小程序调起支付参数
   * @param appId String 小程序APPID
   * @param prepayId String JSAPI下单生成的prepay_id
   * @param privateKey String 微信支付私钥
   * @returns MiniProgramPaymentParameters
   * @link https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_5_4.shtml
   */
  buildMiniProgramPayment ( prepayId: string) {
    const nonceStr = createNonceStr();
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `${this.appId}\n${timestamp}\n${nonceStr}\nprepay_id=${prepayId}\n`;
    const paySign = crypto.createSign('sha256WithRSAEncryption').update(message).sign(this.privateKey, 'base64');
    return {
      timeStamp: timestamp.toString(),
      nonceStr,
      package: `prepay_id=${prepayId}`,
      signType: 'RSA',
      paySign,
    };
  }


    /**
   * 支付通知处理程序
   * @param publicKey 
   * @param apiKey 
   * @param req 
   * @param res 
   * @returns 
   * @link https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_5_5.shtml
   */
  async paidCallback (req):Promise<any> {
    const signature = req.headers['wechatpay-signature'];
    const platformSerial = req.headers['wechatpay-serial'];
    const timestamp = req.headers['wechatpay-timestamp'];
    const nonce = req.headers['wechatpay-nonce'];
    let rawBody;
    rawBody = JSON.stringify(req.body);
    console.log(`Wechatpay-Signature = ${signature}`);
    console.log(`Wechatpay-Serial = ${platformSerial}`);
    console.log(`Wechatpay-Timestamp = ${timestamp}`);
    console.log(`Wechatpay-Nonce = ${nonce}`);
    console.log(`Body = ${typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody)}`);
    let verified = false;
    const responseData = { code: 'FAIL', message: '' };
    let result: Trade = {} as Trade;
    const serial = this.getCertificateSn(this.publicKey);
    if (serial === platformSerial) {
      verified = this.verifySignature(this.publicKey, timestamp as string, nonce as string, rawBody, signature as string);
      if (verified) {
        const resource: CallbackResource = req.body['resource'];
        console.log(resource)
        result = this.decryptCipherText<Trade>(this.apiKey, resource.ciphertext, resource.associated_data, resource.nonce);
      } else {
        responseData.message = 'VERIFY SIGNATURE FAIL';
      }
    } else {
      responseData.message = 'SERIAL INCORRECT';
    }

    if (verified) {
        return {error:0,data:result}
    } else {
      return {error:1,data:responseData}
    }
  }

   /**
   * 读取x509证书序列号
   * @param publicKey 
   * @returns 
   */
  getCertificateSn (publicKey: Buffer | string): string {
    return pki.certificateFromPem(publicKey.toString()).serialNumber.toUpperCase();
    //return this.serialNo
  }


   /**
   * 回调或者通知签名验证方法
   * @param publicKey 
   * @param timestamp 
   * @param nonce 
   * @param body 
   * @param signature 
   * @returns 
   */
  private verifySignature (publicKey: Buffer | string, timestamp: string, nonce: string, body: string | object, signature: string): boolean {
    const message = `${timestamp}\n${nonce}\n${typeof body === 'string' ? body : JSON.stringify(body)}\n`;
    const verify = crypto.createVerify('RSA-SHA256').update(Buffer.from(message));
    return verify.verify(publicKey, signature, 'base64');
  }

    /**
   * 报文解密
   * @param apiKey 
   * @param cipher 
   * @param associatedData 
   * @param nonce 
   * @returns 
   * @link https://pay.weixin.qq.com/wiki/doc/apiv3/wechatpay/wechatpay4_2.shtml
   */
  private decryptCipherText<T> (apiKey: string, cipher: string, associatedData: string, nonce: string): T {
    // algorithm: AEAD_AES_256_GCM
    const buff = Buffer.from(cipher, 'base64');
    const authTag = buff.slice(buff.length - 16);
    const data = buff.slice(0, buff.length - 16);
    const decipher = crypto.createDecipheriv('aes-256-gcm', apiKey, nonce);
    decipher.setAuthTag(authTag);
    decipher.setAAD(Buffer.from(associatedData));
    const decoded = decipher.update(data, undefined, 'utf8');
    decipher.final();
    try {
      return JSON.parse(decoded);
    } catch (e) {
      return decoded as unknown as T;
    }
  }


   /**
   * 发送订阅消息
   * 
   * 该接口用于发送订阅消息。
   * @param params 
   * @param accessToken 
   * @returns 
   * @link https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-message-management/subscribe-message/sendMessage.html
   */
  public sendMessage (params, accessToken: string) {
    const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`;
    return axios.post<DefaultRequestResult>(url, params);
  }


    //统一下单
    create(createWechatDto: CreateWechatDto) {
        return 'This action adds a new wechat';
    }

    findAll() {
        return `This action returns all wechat`;
    }

    findOne(id: number) {
        return `This action returns a #${id} wechat`;
    }

    update(id: number, updateWechatDto: UpdateWechatDto) {
        return `This action updates a #${id} wechat`;
    }

    remove(id: number) {
        return `This action removes a #${id} wechat`;
    }
}
