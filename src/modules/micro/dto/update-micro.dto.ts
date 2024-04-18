import { PartialType } from '@nestjs/mapped-types';
import { CreateMicroDto } from './create-micro.dto';

export class UpdateMicroDto extends PartialType(CreateMicroDto) {
  id: number;
}
