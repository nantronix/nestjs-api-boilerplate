import {
  Entity,
  ObjectIdColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  JoinTable,
  OneToMany,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Exclude, plainToClass } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OcrEntity } from './ocr.entity';

@Entity({
  name: 'mmx_ocr_files',
  orderBy: {
    id: 'ASC',
  },
})
export class OcrFilesEntity {
  @ApiProperty({ description: 'The id of the aiman' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'tinyint',
    width: 4,
    default: '0',
    comment: '0:待上传，1：已上传,-1:已删除',
  })
  status: number;

  //uuid
  @ApiProperty({ description: 'uuid' })
  @Column({ type: 'varchar', nullable: true })
  @Generated('uuid')
  uuid: string;

  @ApiProperty({ description: 'unionid' })
  @Column({ type: 'varchar',length:36, nullable: true })
  union_id: string;

  //add note for status change reason
  @ApiProperty({ description: 'status_note' })
  @Column({ type: 'varchar', nullable: true })
  note: string;

  @ApiProperty({ description: 'file_name' })
  @Column({ type: 'varchar', nullable: true })
  file_name: string;

  //file path
  @ApiProperty({ description: 'file_path' })
  @Column({ type: 'varchar', nullable: true })
  file_path: string;

  //add file extension
  @ApiProperty({ description: 'file_extension' })
  @Column({ type: 'varchar', nullable: true })
  file_ext: string;
  //add size of file
  @ApiProperty({ description: 'file_size' })
  @Column({ type: 'int', nullable: true })
  file_size: number;

  @ApiProperty({ description: '新建时间' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => OcrEntity, (ocr) => ocr.files) // 将另一面指定为第二个参数
  @JoinColumn({ name: 'ocr_id' })
  ocr: OcrEntity;

  @ApiProperty({ description: 'ocr_id' })
  @Column({ nullable: true })
  ocr_id: number;



  constructor(partial: Partial<OcrFilesEntity>) {
      if (partial) {
          //Object.assign(this, plainToClass(OcrFilesEntity, partial, { excludeExtraneousValues: true }));
          Object.assign(this, partial);
          this.updated_at = new Date();
      }
  }
}

