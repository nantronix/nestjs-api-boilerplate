import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, MaxLength, maxLength } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty({ message: 'uuid字段不能为空' })
  @IsString({ message: 'uuid字段必须是 String 类型' })
  readonly uuid: string;


  @IsNotEmpty({ message: 'name字段不能为空' })
  @IsString({ message: 'name字段必须是 String 类型' })
  readonly name: string;

  @IsNotEmpty({ message: 'user_name字段不能为空' })
  @IsString({ message: 'user_name字段必须是 String 类型' })
  readonly user_name: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty({ message: 'country字段不能为空' })
  readonly country: string;

  @IsNotEmpty({ message: 'province不能为空' })
  readonly province: string;

  @IsNotEmpty({ message: 'city不能为空' })
  readonly city: string;

  @IsNotEmpty({ message: 'district不能为空' })
  readonly district: string;

  @IsNotEmpty({ message: 'address字段不能为空' })
  @IsString({ message: 'address字段必须是 String 类型' })
  readonly address: string;

  // @IsIn([0,1,2],{message:'性别超出范围'})
  readonly gender: number;

  @IsPhoneNumber('CN')
  readonly phone: string;
  //   readonly role?: string | number;
}
