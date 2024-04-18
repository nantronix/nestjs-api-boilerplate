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
import { WorkflowApplicationEntity } from './workflow_application.entity';

@Entity({
  name: 'mmx_workflow',
  orderBy: {
    id: 'ASC',
  },
})
export class WorkflowEntity {
  @ApiProperty({ description: 'The id of the aiman' })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'tinyint',
    width: 4,
    default: '0',
    comment: '0:下架:1:上架,2:删除',
  })
  status: number;
  
  //uuid
  @ApiProperty({ description: 'uuid' })
  @Column({ type: 'varchar', nullable: true })
  @Generated('uuid')
  uuid: string;

  //workflow名称
  @ApiProperty({ description: 'workflow名称' })
  @Column({ type: 'varchar', nullable: true })
  name: string;

  //组织的id, type:int ,default:0
  @ApiProperty({ description: '组织的id' })
  @Column({ type: 'int', default: 0 })
  org_id: number;

  //user id,如果是个账户，那么就是user id,如果是企业账户，那么就是企业的id
  @ApiProperty({ description: 'user id' })
  @Column({ type: 'int', default: 0 })
  user_id: number;

  //workflow的描述
  @ApiProperty({ description: 'workflow的描述' })
  @Column({ type: 'text', nullable: true })
  description: string;

  //由谁创建的
  @ApiProperty({ description: '由谁创建的' })
  @Column({ type: 'int', default: 0 })
  created_by: number;
 
  @ApiProperty({ description: '新建时间' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => WorkflowApplicationEntity, (applications) => applications.workflow)
  applications: WorkflowApplicationEntity;


  constructor(partial: Partial<WorkflowEntity>) {
      if (partial) {
          //Object.assign(this, plainToClass(OcrFilesEntity, partial, { excludeExtraneousValues: true }));
          Object.assign(this, partial);
          this.updated_at = new Date();
      }
  }
}



