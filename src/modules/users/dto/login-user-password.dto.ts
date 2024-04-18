import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class LoginUserPasswordDto {
	
    @IsNotEmpty()
	readonly phone: string

	@IsNotEmpty()
	readonly password: string
}
