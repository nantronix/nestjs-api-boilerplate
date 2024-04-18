import { Module } from '@nestjs/common';
import { VirtualEmployeeService } from './virtual_employee.service';
import { VirtualEmployeeController } from './virtual_employee.controller';

@Module({
  controllers: [VirtualEmployeeController],
  providers: [VirtualEmployeeService]
})
export class VirtualEmployeeModule {}
