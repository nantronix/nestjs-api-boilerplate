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

}
