
import {
	Controller,
	Get,
	Request,
	Post,
	UseGuards,
	Param,
	Res,
	UseInterceptors,
	UploadedFile,
	Body,
	Query,
	Logger,
    Version
} from '@nestjs/common';
import { CacheInterceptor }  from '@nestjs/cache-manager';
import { I18n, I18nContext } from 'nestjs-i18n';
import { AuthGuard } from '@nestjs/passport';
import {
	ApiBearerAuth,
	ApiConsumes,
	ApiBody,
	ApiOperation,
	ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
//import chalk from 'chalk'
import { AppService } from './app.service';
import { ErrorResponseDto } from './modules/users/dto/error-response.dto'
import { LoginResponseDto } from './modules/users/dto/login-response.dto'
import {LoginUserDto } from './modules/users/dto/login-user.dto'
import { AuthService } from './auth/auth.service'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';


@ApiResponse({
	status: 401,
	description: 'Unauthorized.',
	type: ErrorResponseDto
})
@ApiResponse({ status: 403, description: 'Forbidden.', type: ErrorResponseDto })
@ApiTags('基础')
@Controller()
@UseInterceptors(CacheInterceptor) //缓存
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly authService: AuthService,
             ) {}

  @Get()
  async getHello(@I18n() i18n: I18nContext){
      return await i18n.t('test.HELLO');
    //return this.appService.getHello();
  }

  @Post('/req')
	postHello(@Request() req) {
		Logger.log((`🤬 ${JSON.stringify(req.body)}`), 'Check')
		return req.body
	}

    //login
   
	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: LoginResponseDto
	})
	//@UseGuards(AuthGuard('local'))
    @UseGuards(LocalAuthGuard)
	@ApiOperation({
		summary: 'Retrieve one Acess token 👻'
	})
	@Post('auth/login')
	@ApiBody({ description: '用户名和密码', type: LoginUserDto })
	login(@Request() req): Promise<LoginResponseDto> {
		return this.authService.login(req.user)
    }
  
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
    return req.user;
    }


}
