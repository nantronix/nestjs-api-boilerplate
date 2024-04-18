import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MicroService } from './micro.service';
import { CreateMicroDto } from './dto/create-micro.dto';
import { UpdateMicroDto } from './dto/update-micro.dto';

@Controller()
export class MicroController {
  constructor(private readonly microService: MicroService) {}

  @MessagePattern('createMicro')
  create(@Payload() createMicroDto: CreateMicroDto) {
    return this.microService.create(createMicroDto);
  }

  @MessagePattern('findAllMicro')
  findAll() {
    return this.microService.findAll();
  }

  @MessagePattern('findOneMicro')
  findOne(@Payload() id: number) {
    return this.microService.findOne(id);
  }

  @MessagePattern('updateMicro')
  update(@Payload() updateMicroDto: UpdateMicroDto) {
    return this.microService.update(updateMicroDto.id, updateMicroDto);
  }

  @MessagePattern('removeMicro')
  remove(@Payload() id: number) {
    return this.microService.remove(id);
  }
}
