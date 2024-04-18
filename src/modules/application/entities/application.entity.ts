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

@Entity({
  name: 'mmx_application',
  orderBy: {
    id: 'ASC',
  },
})
export class ApplicationEntity {
  @ApiProperty({ description: 'The id of the aiman' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'tinyint',
    width: 1,
    default: '0',
    comment: '0:下架:1:上架,2:删除',
  })
  status: number;

  //uuid
  @ApiProperty({ description: 'uuid' })
  @Column({ type: 'varchar', nullable: true })
  @Generated('uuid')
  uuid: string;

  //是否是第三方应用
  @ApiProperty({ description: '是否是第三方应用' })
  @Column({ type: 'tinyint', width: 4, default: '0' })
  is_third: number;

  //应用名称
  @ApiProperty({ description: '应用名称' })
  @Column({ type: 'varchar', nullable: true })
  name: string;

  //应用图标
  @ApiProperty({ description: '应用图片' })
  @Column({ type: 'varchar', nullable: true })
  icon: string;

  //组织也可以创建应用,org_id,default is 0
  @ApiProperty({ description: '组织也可以创建应用' })
  @Column({ type: 'int', width: 11, default: '0' })
  org_id: number;
  
  //应用参数
  @ApiProperty({ description: '应用参数' })
  @Column({ type: 'text', nullable: true })
  params: string;

  //应用的唯一标识
  @ApiProperty({ description: '应用的唯一标识' })
  @Column({ type: 'varchar', nullable: true })
  key: string;

  @ApiProperty({ description: '新建时间' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updated_at: Date;


  constructor(partial: Partial<ApplicationEntity>) {
      if (partial) {
          //Object.assign(this, plainToClass(OcrFilesEntity, partial, { excludeExtraneousValues: true }));
          Object.assign(this, partial);
          this.updated_at = new Date();
      }
  }
}


