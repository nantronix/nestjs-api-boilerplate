import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VirtualEmployeeService } from './virtual_employee.service';
import { CreateVirtualEmployeeDto } from './dto/create-virtual_employee.dto';
import { UpdateVirtualEmployeeDto } from './dto/update-virtual_employee.dto';

@Controller('virtual-employee')
export class VirtualEmployeeController {
  constructor(private readonly virtualEmployeeService: VirtualEmployeeService) {}

  @Post()
  create(@Body() createVirtualEmployeeDto: CreateVirtualEmployeeDto) {
    return this.virtualEmployeeService.create(createVirtualEmployeeDto);
  }

  @Get()
  findAll() {
    return this.virtualEmployeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.virtualEmployeeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVirtualEmployeeDto: UpdateVirtualEmployeeDto) {
    return this.virtualEmployeeService.update(+id, updateVirtualEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.virtualEmployeeService.remove(+id);
  }
}
