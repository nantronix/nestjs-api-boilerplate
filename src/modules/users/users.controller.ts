import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ErrorResponseDto } from './dto/error-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiResponse({
  status: 401,
  description: 'Unauthorized.',
  type: ErrorResponseDto,
})
@ApiResponse({ status: 403, description: 'Forbidden.', type: ErrorResponseDto })
@ApiTags('用户')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('getUser/:id')
  async getUser(@Query() query) {
    return {
      id: 1,
      name: 'user-test',
      email: 'sss@admin.com',
      phone: '18961735889',
    };
  }

  @Post('login')
  async userLogin() {
    return {
      error: 0,
      errmsg: '登陆OK',
      data: {
        id: 1,
        name: 'user-test',
        email: 'sss@admin.com',
        phone: '18961735889',
      },
    };
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Headers() headers) {
    return this.usersService.create(createUserDto);
  }

 /* @UseGuards(JwtAuthGuard)
  @Post('get_phone_number')
  getPhoneNumber(@Request() req) {
    return this.usersService.getPhoneNumber(req.body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get_user_info')
  getUserInfo(@Request() req) {
    return this.usersService.getUserInfo(req.user);
  }

  //get groups
  @UseGuards(JwtAuthGuard)
  @Get('get_groups')
  getGroups(@Request() req) {
    return this.usersService.getGroups();
  }*/
}
