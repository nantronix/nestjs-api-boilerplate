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
import { WorkflowEntity } from './workflow.entity';

@Entity({
  name: 'mmx_workflow_applications',
  orderBy: {
    id: 'ASC',
  },
})
export class WorkflowApplicationEntity {
  @ApiProperty({ description: 'The id of the aiman' })
  @PrimaryGeneratedColumn()
  id: number;

  //uuid
  @ApiProperty({ description: 'uuid' })
  @Column({ type: 'varchar', nullable: true })
  @Generated('uuid')
  uuid: string;

  //application id
  @ApiProperty({ description: 'application id' })
  @Column({ type: 'int', default: 0 })
  application_id: number;

  //application key
  @ApiProperty({ description: 'application action key' })
  @Column({ type: 'varchar', nullable: true })
  action: string;

  //应用的参数信息
  @ApiProperty({ description: '应用的参数信息' })
  @Column({ type: 'text', nullable: true })
  params: string;

  //应用的排序
  @ApiProperty({ description: '应用的排序' })
  @Column({ type: 'int', default: 0 })
  order: number;

  @ApiProperty({ description: '新建时间' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => WorkflowEntity, (workflow) => workflow.applications)
  @JoinColumn({ name: 'workflow_id' })
  workflow: WorkflowEntity;

  @ApiProperty({ description: 'workflow id' })
  @Column({ nullable: true })
  workflow_id: number;



  constructor(partial: Partial<WorkflowApplicationEntity>) {
     
  }
}




