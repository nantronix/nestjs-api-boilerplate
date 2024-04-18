import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class LoginUserCodeDto {
	@IsNotEmpty()
	readonly phone: number 

	
	@IsNotEmpty()
	readonly code: number
}
