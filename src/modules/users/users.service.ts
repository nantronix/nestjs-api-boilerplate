import {
  BadRequestException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { WeixinUserEntity } from './entities/weixin_user.entity';
import { UserGroupEntity } from './entities/user_group.entity';
import { DouyinUserEntity } from './entities/douyin_user.entity';
import { AccountLogEntity } from './entities/account_log.entity';
import { WechatService } from '../wechat/wechat.service';
import { DouyinService } from '../douyin/douyin.service';
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const tz = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(tz);
export type User = any;
@Injectable()
export class UsersService {
  private readonly users: User[];
  constructor(
    private readonly wechatService: WechatService,
    private readonly douyinService: DouyinService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(UserGroupEntity)
    private readonly userGroupRepository: Repository<UserGroupEntity>,
    @InjectRepository(WeixinUserEntity)
    private readonly weixinUserRepository: Repository<WeixinUserEntity>,
    @InjectRepository(DouyinUserEntity)
    private readonly douyinUserRepository: Repository<DouyinUserEntity>,
    @InjectRepository(AccountLogEntity)
    private readonly accountLogRepository: Repository<AccountLogEntity>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    this.users = [
      {
        id: 0,
        username: '18961735889',
        password: '@222222@',
      },
    ];
  }
  async create(userData: CreateUserDto) {
    // return 'This action adds a new user';
    return await this.usersRepository.save(userData);
  }

  async wxLogin({ code, uuid }) {
    const data = await this.wechatService.code2Session(code);
    console.log(data);
    console.log(code);
    if (data['openid']) {
      const checkUser = await this.weixinUserRepository.findOne({
        where: { openid: data['openid'] },
        relations: ['user'],
      });
      console.log(checkUser);
      if (!checkUser) {
        const userData = { name: data['openid'], user_name: data['openid'] };
        if (uuid && uuid != '') {
          const feature_user = await this.usersRepository.findOne({
            where: { uuid },
          });
          if (feature_user) {
            userData['feature_id'] = feature_user.id;
            const logData = {
              user_id: feature_user.id,
              action: 1,
              action_type: 'feature_user',
              amount: 1,
            };
            await this.accountChange(logData);
          }
        }
        const user = await this.usersRepository.save(userData);
        const weixinUser = { ...data };
        weixinUser['user'] = user;
        const wx = await this.weixinUserRepository.save(weixinUser);
        //加钻石
        const logData = {
          user_id: user.id,
          action: 1,
          action_type: 'new_user',
          amount: 12,
        };
        await this.accountChange(logData);

        return wx;
      } else {
        /*  if(uuid && uuid !=""){
         const feature_user = await this.usersRepository.findOne({where:{uuid}})
         if(feature_user){
             const logData = {user_id:feature_user.id,action:1,action_type:'feature_user',amount:1 }
             await this.accountChange(logData)
         }
        }*/
        return checkUser;
        //return {error:0,errmsg:'OK',user:checkUser.user}
      }
    } else {
      return data;
    }
  }

  //抖音登录
  async ttLogin({ code, uuid }) {
    const resData = await this.douyinService.code2Session(code);
    console.log(resData['data']);
    //console.log(code)
    let data = resData['data']['data'];

    if (data['openid'] != '') {
      const checkUser = await this.douyinUserRepository.findOne({
        where: { openid: data['openid'] },
        relations: ['user'],
      });
      console.log(checkUser);
      if (!checkUser) {
        const userData = {
          name: data['openid'],
          user_name: data['openid'],
          client: 1,
        };
        if (uuid && uuid != '') {
          const feature_user = await this.usersRepository.findOne({
            where: { uuid },
          });
          if (feature_user) {
            userData['feature_id'] = feature_user.id;
            const logData = {
              user_id: feature_user.id,
              action: 1,
              action_type: 'feature_user',
              amount: 1,
            };
            await this.accountChange(logData);
          }
        }
        const user = await this.usersRepository.save(userData);
        const weixinUser = { ...data };
        weixinUser['user'] = user;
        const wx = await this.douyinUserRepository.save(weixinUser);
        const logData = {
          user_id: user.id,
          action: 1,
          action_type: 'new_user',
          amount: 12,
        };
        await this.accountChange(logData);

        return wx;
      } else {
        if (checkUser.user.client == 0) {
          await this.usersRepository.update(checkUser.user.id, { client: 1 });
        }
        /*  if(uuid && uuid !=""){
         const feature_user = await this.usersRepository.findOne({where:{uuid}})
         if(feature_user){
             const logData = {user_id:feature_user.id,action:1,action_type:'feature_user',amount:1 }
             await this.accountChange(logData)
         }
        }*/
        return checkUser;
        //return {error:0,errmsg:'OK',user:checkUser.user}
      }
    } else {
      return data;
    }
  }

  async getPhoneNumber({ code }, user) {
    /*let accessToken:string = await this.cacheManager.get('mw_access_token');
      if(!accessToken){
          const tokenRes = await this.wechatService.getAccessToken()
          //console.log(tokenRes.data)
          if(tokenRes.data['access_token']){
             await this.cacheManager.set('mw_access_token',tokenRes.data['access_token'], { ttl: 6000 });
             accessToken = tokenRes.data['access_token']
          }
      }
      console.log('accessToken',accessToken)*/
    const accessToken = await this.wechatService.getAccessToken();

    const phoneRes = await this.wechatService.getPhoneNumber(code, accessToken);
    if (phoneRes.data && phoneRes.data['errcode'] == 0) {
      const checkUser = await this.weixinUserRepository.findOne({
        where: { openid: user['openid'] },
        relations: ['user'],
      });
      if (!checkUser) {
        return { error: 1, errmsg: '没找到用户信息,请稍候再试' };
      }
      const userInfo = checkUser['user'];
      userInfo['phone'] = phoneRes.data['phone_info']['phoneNumber'];
      checkUser.phone_number = phoneRes.data['phone_info']['phoneNumber'];
      checkUser.pure_phone_number =
        phoneRes.data['phone_info']['purePhoneNumber'];
      checkUser.country_code = String(
        phoneRes.data['phone_info']['countryCode'],
      );
      await this.weixinUserRepository.save(checkUser);
      const resUser = await this.usersRepository.save(userInfo);
      return { error: 0, errmsg: '登陆成功', data: resUser };
    } else {
      console.log(phoneRes);
      await this.cacheManager.del('mw_access_token');
    }
    //console.log(phoneRes)
    return { error: 1, errmsg: '登陆失败,请稍候再试' };
  }

  //账户变动
  async accountChange(postData) {
    try {
      //添加事务
      //账户变动
      const last_log = await this.accountLogRepository.findOne({
        where: { user_id: postData['user_id'] },
        order: {
          id: 'DESC',
        },
      });
      let balance = 0;
      if (last_log) {
        balance = last_log.balance;
      }
      postData['balance'] = balance + postData['amount'];
      await this.accountLogRepository.save(postData);
      let updateData = {
        account: postData['balance'],
        updated_at: new Date(),
      };
      if (postData['action_type'] == 'get_point') {
        //获取绝对值
        //updateData['point'] = -postData['amount']*3;
        //set point + amount*3,如果是负数，则转正数后再加,同时更新account
        await this.usersRepository.update(postData['user_id'], {
          point: () => `point + ${Math.abs(postData['amount']) * 3}`,
          ...updateData,
        });
      } else {
        await this.usersRepository.update(postData['user_id'], updateData);
      }
      return true;
      //用户账户更改
    } catch (err) {
      return false;
    }
  }
  //获取余额
  async getUser(user_id) {
    try {
      //await this.checkNewUser(user_id)
      const user = await this.usersRepository.findOne({
        where: { id: user_id },
        relations: ['group'],
      });
      return user;
      //用户账户更改
    } catch (err) {
      return false;
    }
  }

  //getUserByUUid
  async getUserByUUid(uuid) {
    try {
      const user = await this.usersRepository.findOne({ where: { uuid } });
      return user;
    } catch (err) {
      return { id: 0 };
    }
  }
  //
  async getUserInfo({ user_id }) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: user_id },
        relations: ['group'],
      });
      return user;
      //用户账户更改
    } catch (err) {
      return { id: 0 };
    }
  }

  //getOpenId
  async getOpenId({ user_id }) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: user_id },
      });
      if (user.client == 0) {
        const wxUser = await this.weixinUserRepository.findOne({
          where: { user_id },
        });
        return { openid: wxUser.openid, client: 0 };
      } else if (user.client == 1) {
        const ttUser = await this.douyinUserRepository.findOne({
          where: { user_id },
        });
        return { openid: ttUser.openid, client: 1 };
      }
      return { openid: '', client: user.client };
      //用户账户更改
    } catch (err) {
      return { openid: '' };
    }
  }

  async checkNewUser(user_id) {
    const log = await this.accountLogRepository.findOne({ where: { user_id } });
    if (!log) {
      const postData = {
        user_id,
        action: 1,
        action_type: 'new_user',
        amount: 1,
      };
      await this.accountChange(postData);
    }
    return;
  }

  async sendMessage() {
    const params = {
      template_id: 'XR3s2tOqLtjrUppCNVbqKDum6HCpE33-vUp66K1fwD4',
      page: 'pages/mine/index',
      touser: 'oFgsG5o_rpqicK8BEjLIBF3LF-DU',
      data: {
        character_string6: { value: '20022' },
        thing1: { value: '码码熊AI秀' },
        thing12: { value: '图片已生成' },
        phrase14: { value: '已生成图片' },
        time16: { value: '2018-01-01' },
      },
    };
    const accessToken = await this.wechatService.getAccessToken();

    const phoneRes = await this.wechatService.sendMessage(params, accessToken);
    //console.log(phoneRes)
    return { error: 0, errmsg: 'OK', accessToken };
  }

  /* findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }*/

  async findOneTest(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  // 用户主页的动态和问答列表
  /**
   *
   *
   * @param {*}
   * user_id
   * type:0动态 1问答,默认0
   * page:页码
   * limit
   * @return {*}
   * @memberof CommunityService
   */

  //get user groups
  async getGroups() {
    const groups = await this.userGroupRepository.find({
      order: { id: 'ASC' },
    });
    return groups;
  }

  //会员升级&&展期
  async upgradeMember(postData) {
    try {
      const targetTimezone = 'Asia/Shanghai';
      const end_date = dayjs(postData['valid_date'])
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss');
      const utc_end_date = dayjs
        .tz(end_date, targetTimezone)
        .utc()
        .format('YYYY-MM-DD HH:mm:ss');
      const note = end_date + '/' + utc_end_date;
      await this.usersRepository.update(postData['user_id'], {
        updated_at: new Date(),
        end_date: utc_end_date,
        group_id: postData['group_id'],
        note,
      });
      return true;
      //用户账户更改
    } catch (err) {
      return false;
    }
  }
}
