import { Injectable } from '@nestjs/common';
import { CreateExcelDto } from './dto/create-excel.dto';
import { UpdateExcelDto } from './dto/update-excel.dto';

@Injectable()
export class ExcelService {
  create(createExcelDto: CreateExcelDto) {
    return 'This action adds a new excel';
  }

  findAll() {
    return `This action returns all excel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} excel`;
  }

  update(id: number, updateExcelDto: UpdateExcelDto) {
    return `This action updates a #${id} excel`;
  }

  remove(id: number) {
    return `This action removes a #${id} excel`;
  }
}
