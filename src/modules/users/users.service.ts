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
import { UserGroupEntity } from './entities/user_group.entity';
import { AccountLogEntity } from './entities/account_log.entity';
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
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(UserGroupEntity)
    private readonly userGroupRepository: Repository<UserGroupEntity>,
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

}
