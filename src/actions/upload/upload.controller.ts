import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @MessagePattern('createUpload')
  create(@Payload() createUploadDto: CreateUploadDto) {
    return this.uploadService.create(createUploadDto);
  }

  @MessagePattern('findAllUpload')
  findAll() {
    return this.uploadService.findAll();
  }

  @MessagePattern('findOneUpload')
  findOne(@Payload() id: number) {
    return this.uploadService.findOne(id);
  }

  @MessagePattern('updateUpload')
  update(@Payload() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(updateUploadDto.id, updateUploadDto);
  }

  @MessagePattern('removeUpload')
  remove(@Payload() id: number) {
    return this.uploadService.remove(id);
  }
}
