import { PartialType } from '@nestjs/swagger';
import { CreateVirtualEmployeeDto } from './create-virtual_employee.dto';

export class UpdateVirtualEmployeeDto extends PartialType(CreateVirtualEmployeeDto) {}
