import { Entity, ObjectIdColumn, Column,Generated,CreateDateColumn,UpdateDateColumn,PrimaryGeneratedColumn,OneToOne,JoinColumn,OneToMany} from 'typeorm'
import { Exclude, plainToClass } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { TaskApplicationEntity } from './task_application.entity'

@Entity({
	name: 'mmx_task',
	orderBy: {
		id: 'ASC'
	}
})

export class TaskEntity {
	@PrimaryGeneratedColumn()
	id: number;
	// basic
    
    @Column()
    @Generated("uuid")
	uuid: string

    @Column({ type: "tinyint", width:1, default:'0',comment:'0:等待中,1:进行中,2:成功,5:失败'})
	status:number

    //任务关联的工作流id
    @ApiProperty({ description: '任务关联的工作流id' })
    @Column({ type: 'int', default: 0 })
    workflow_id: number;

    //任务归属于的企业id
    @ApiProperty({ description: '任务归属于的企业id' })
    @Column({ type: 'int', default: 0 })
    org_id: number;

    //哪位用户执行的任务
    @ApiProperty({ description: '哪位用户执行的任务' })
    @Column({ type: 'int', default: 0 })
    user_id: number;

    //start time,任务开始时间
    @ApiProperty({ description: 'start time,任务开始时间' })
    @Column({type:"datetime",nullable:true,default:() =>'CURRENT_TIMESTAMP'})
    start_time:Date

    //end time,任务结束时间
    @ApiProperty({ description: 'end time,任务结束时间' })
    @Column({type:"datetime",nullable:true})
    end_time:Date

    //当前任务的执行进度
    @ApiProperty({ description: '当前任务的执行进度' })
    @Column({ type: 'int', default: 0 })
    step: number;

    //任务的总步骤
    @ApiProperty({ description: '任务的总步骤' })
    @Column({ type: 'int', default: 0 })
    total_step: number;

    //任务的执行结果
    @ApiProperty({ description: '任务的执行结果' })
    @Column({ type: 'text', nullable: true })
    result: string;

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
    
    //one to many, 一个任务可以有多个应用
    @OneToMany(type => TaskApplicationEntity, (applications) => applications.task)
    applications: TaskApplicationEntity;
    


	constructor(partial: Partial<TaskEntity>) {
        if (partial) {
          Object.assign(this, partial);
          this.updated_at = new Date();
      }
		/*if (partial) {
			Object.assign(this, partial)
			this._id = this._id || uuidv4()
			this.avatar =
				this.avatar ||
				'https://res.cloudinary.com/chnirt/image/upload/v1573662028/rest/2019-11-13T16:20:22.699Z.png'
			this.verified = this.verified || false
			this.createdAt = this.createdAt || +new Date()
			this.updatedAt = +new Date()
		}*/
	}
}

    

