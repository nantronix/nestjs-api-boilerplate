import { Injectable,  Inject } from '@nestjs/common';
import {CACHE_MANAGER} from '@nestjs/cache-manager';

import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, In } from 'typeorm';
import { AxiosResponse, AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { createNonceStr } from '../../utils';
import * as crypto from 'crypto';
import axios from 'axios';
import { readFileSync } from 'fs';
import { pki } from 'node-forge';

@Injectable()
export class DouyinService {
  private readonly appId: string;
  private readonly appSecret: string;
  private readonly mchId: string;
  private readonly serialNo: string;
  private readonly privateKey: any;
  private readonly publicKey: any;
  private readonly apiKey: any;
  private readonly salt: any;
  private readonly token: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    this.appId = this.configService.get<string>('tt.appid');
    this.appSecret = this.configService.get<string>('tt.appsecret');
    this.salt = 'xYJgRW8IpOTBbbFTlctoRuG8UjhsJuN8uKkG5ZpY';
    this.token = '@5de2bac88cf8c42d9da69a0@';
    //this.mchId = '1231086502'
    //this.serialNo = '4144B232C9025BDAE8CFA1BC3E29C4AC74D7AE1D'
    //this.privateKey = readFileSync('/data/projects/aishow/cert/apiclient_key.pem') //私钥
    //this.publicKey = readFileSync('/data/projects/aishow/cert/platform_cert.pem') //公钥
    //this.apiKey =  'e7a2a02ed4e883c96a1362c1023424d7'  //v3 key
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
  public async getAccessToken() {
    let appId = this.appId;
    let secret = this.appSecret;
    let access_token: string = await this.cacheManager.get('tt_access_token');
    if (access_token) {
      return access_token;
    }
    const url = 'https://developer.toutiao.com/api/apps/v2/token';
    //const url = 'https://open-sandbox.douyin.com/api/apps/v2/token';
    // eslint-disable-next-line camelcase
    const tokenRes = await axios.post(url, {
      grant_type: 'client_credential',
      appid: appId,
      secret,
    });
    console.log(tokenRes);
    if (tokenRes.data['err_no'] == 0) {
      await this.cacheManager.set(
        'tt_access_token',
        tokenRes.data.data['access_token'],
        7000,
      );
      access_token = tokenRes.data.data['access_token'];
      return access_token;
    }
    return false;
  }

  //
  async code2Session(code: string): Promise<any[]> {
    const url = `https://developer.toutiao.com/api/apps/v2/jscode2session`;
    return await axios.post(url, {
      appid: this.appId,
      secret: this.appSecret,
      code,
    });
  }

  async checkImage(access_token, image_data): Promise<any> {
    const url = `https://developer.toutiao.com/api/apps/censor/image`;
    return await axios.post(
      url,
      {
        app_id: this.appId,
        access_token,
        image_data,
      },
      {
        headers: { 'X-Token': access_token },
      },
    );
  }

  async checkText(access_token, text): Promise<any> {
    const url = 'https://developer.toutiao.com/api/v2/tags/text/antidirt';
    const res = await axios.post(
      url,
      {
        tasks: [
          {
            content: text,
          },
        ],
      },
      {
        headers: { 'X-Token': access_token },
      },
    );

    console.log(res);
    return res;
  }

  async checkTest() {
    const token = await this.getAccessToken();
    if (token) {
      let bitmap = readFileSync(
        '/data/projects/aishow/checkimg/_000kfAKzhUkqVXc8iEnPzY3siHV4NWdSifa/51f92bed-2135-4b1b-9fe3-c90f3d0adad9.png',
      );
      const instance = new Buffer(bitmap);
      let base64str = instance.toString('base64');
      const res = await this.checkImage(token, base64str);
      console.log(res);
      return res.data;
    } else {
      return token;
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
  public sendMessage(params) {
    params['app_id'] = this.appId;
    const url = `https://developer.toutiao.com/api/apps/subscribe_notification/developer/v1/notify`;
    return axios.post(url, params);
  }

  /**
   * JSAPI下单
   * @param order 下单信息
   * @param serialNo 私钥序列号
   * @param privateKey 私钥
   * @returns
   * @link https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_5_1.shtml
   */
  async jsapi(order) {
    let data = { ...order };
    data['app_id'] = this.appId;
    /*data['out_order_no'] = order.out_trade_no;
      data['total_amount'] = order.total_fee
      data['subject'] = order.description
      data['body'] = order.description
      data['valid_time'] = 300
      data['cp_extra'] = 'tt_pay'
      data['sign'] = ''
      data['notify_url'] = order.notify_url*/
    data['sign'] = this.getSign(order);
    //const timestamp = Math.floor(Date.now() / 1000);
    //const privateKey = this.privateKey
    //const serialNo = this.serialNo
    //let postData = {appid:this.appId,mchid:this.mchId,...order}
    //const signature = this.generateSignature('POST', url, timestamp, nonceStr, privateKey, postData);
    let url = 'https://developer.toutiao.com/api/apps/ecpay/v1/create_order';
    return axios.post(url, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    //return await this.sendData(postData,url)
  }

  //获取签名
  getSign(params) {
    const skip_arr = ['thirdparty_id', 'app_id', 'sign'];
    let paramArray = new Array();
    for (let k in params) {
      if (skip_arr.indexOf(k) != -1) {
        continue;
      }
      if (params[k] == '') {
        continue;
      }
      paramArray.push(params[k]);
    }
    paramArray.push(this.salt);
    paramArray.sort();
    let signStr = paramArray.join('&');
    return crypto.createHash('md5').update(signStr).digest('hex');
  }

  //传回参数验证
  async paidCallback(query): Promise<any> {
    const { msg_signature, timestamp, msg, nonce } = query;
    const strArr = [this.token, timestamp, nonce, msg].sort();
    const str = strArr.join('');
    const _signature = crypto.createHash('sha1').update(str).digest('hex');
    if (_signature == msg_signature) {
      return true;
    } else {
      return false;
    }
  }
}
