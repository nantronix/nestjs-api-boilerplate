import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { OcrController } from './ocr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcrEntity } from './entities/ocr.entity';
import { OcrFilesEntity } from './entities/ocr_files.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OcrEntity, OcrFilesEntity])],
  controllers: [OcrController],
  providers: [OcrService],
  exports: [OcrService],
})
export class OcrModule {}
