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
import { TaskEntity } from './task.entity';

@Entity({
  name: 'mmx_task_applications',
  orderBy: {
    id: 'ASC',
  },
})
export class TaskApplicationEntity {
  @ApiProperty({ description: 'The id of the aiman' })
  @PrimaryGeneratedColumn()
  id: number;

  //application id
  @ApiProperty({ description: 'application id' })
  @Column({ type: 'int', default: 0 })
  application_id: number;

  //application key
  @ApiProperty({ description: 'application key' })
  @Column({ type: 'varchar', nullable: true })
  application_key: string;

  //application name
  @ApiProperty({ description: 'application name' })
  @Column({ type: 'varchar', nullable: true })
  application_name: string;

  //应用的排序
  @ApiProperty({ description: '应用的排序' })
  @Column({ type: 'int', default: 0 })
  order: number;
  
  //状态
  @ApiProperty({ description: '状态' })
  @Column({ type: 'tinyint',width:1, default: 0, comment: '0:未执行,1:已执行,2:成功,5:失败' })
  status: number;

  //执行结果
  @ApiProperty({ description: '执行结果' })
  @Column({ type: 'text', nullable: true })
  result: string;

  @ApiProperty({ description: '新建时间' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => TaskEntity, (task) => task.applications)
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity;

  @ApiProperty({ description: 'task id' })
  @Column({ nullable: true })
  task_id: number;



  constructor(partial: Partial<TaskApplicationEntity>) {
        if (partial) {
          //Object.assign(this, plainToClass(OcrFilesEntity, partial, { excludeExtraneousValues: true }));
          Object.assign(this, partial);
          this.updated_at = new Date();
      }

     
  }
}





