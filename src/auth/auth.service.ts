import { Injectable } from '@nestjs/common';
import { UsersService } from '../modules/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneTest(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    //console.log('code login')
    const payload = { user_id: user.id, ...user };
    //console.log(user)
    const { id, ...userInfo } = user;
    const expiresIn = 60 * 60 * 24 * 30; //30过期
    return {
      error: 0,
      errmsg: '登陆成功',
      user: userInfo,
      accessToken: this.jwtService.sign(payload),
      expiresIn,
    };
  }

  async wxLogin(req: any) {
    //console.log(req.body)
    const user = await this.usersService.wxLogin({
      code: req.body.code,
      uuid: req.body.feature_id,
    });
    //console.log(user)
    if (user['errcode'])
      return {
        error: 1,
        errmsg: user['errmsg'],
        accessToken: '',
        expiresIn: 0,
      };
    //const payload = user;
    //console.log(JSON.stringify(user['user']))
    let userInfo = user['user'];
    userInfo['client'] = 'mwechat';
    const accessToken = this.jwtService.sign(
      JSON.parse(JSON.stringify(userInfo)),
    );
    delete userInfo['id'];
    //userInfo['id'] = null
    const expiresIn = 60 * 60 * 24 * 30; //30过期
    return {
      error: 0,
      errmsg: '登陆成功',
      user: userInfo,
      accessToken,
      expiresIn,
    };
  }

  //douyin
  async ttLogin(req: any) {
    //console.log(req.body)
    const user = await this.usersService.ttLogin({
      code: req.body.code,
      uuid: req.body.feature_id,
    });
    //console.log(user)
    if (user['openid'] == '') {
      return { error: 1, errmsg: '登陆失败', accessToken: '', expiresIn: 0 };
    }
    //const payload = user;
    //console.log(JSON.stringify(user['user']))
    let userInfo = user['user'];
    userInfo['client'] = 'douyin';
    const accessToken = this.jwtService.sign(
      JSON.parse(JSON.stringify(userInfo)),
    );
    delete userInfo['id'];
    if (!userInfo['phone']) userInfo['phone'] = 'douyin';
    //userInfo['id'] = null
    const expiresIn = 60 * 60 * 24 * 30; //30过期
    return {
      error: 0,
      errmsg: '登陆成功',
      user: userInfo,
      accessToken,
      expiresIn,
    };
  }
}
