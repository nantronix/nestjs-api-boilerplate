import { Injectable } from '@nestjs/common';
import { CreateMicroDto } from './dto/create-micro.dto';
import { UpdateMicroDto } from './dto/update-micro.dto';

@Injectable()
export class MicroService {
  create(createMicroDto: CreateMicroDto) {
    return 'This action adds a new micro';
  }

  findAll() {
    return `This action returns all micro`;
  }

  findOne(id: number) {
    return `This action returns a #${id} micro`;
  }

  update(id: number, updateMicroDto: UpdateMicroDto) {
    return `This action updates a #${id} micro`;
  }

  remove(id: number) {
    return `This action removes a #${id} micro`;
  }
}
