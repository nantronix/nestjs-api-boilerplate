import { Injectable } from '@nestjs/common';
import { CreateVirtualEmployeeDto } from './dto/create-virtual_employee.dto';
import { UpdateVirtualEmployeeDto } from './dto/update-virtual_employee.dto';

@Injectable()
export class VirtualEmployeeService {
  create(createVirtualEmployeeDto: CreateVirtualEmployeeDto) {
    return 'This action adds a new virtualEmployee';
  }

  findAll() {
    return `This action returns all virtualEmployee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} virtualEmployee`;
  }

  update(id: number, updateVirtualEmployeeDto: UpdateVirtualEmployeeDto) {
    return `This action updates a #${id} virtualEmployee`;
  }

  remove(id: number) {
    return `This action removes a #${id} virtualEmployee`;
  }
}
