import {
	Entity,
	ObjectIdColumn,
	Column,
	Generated,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
	OneToOne,
	ManyToOne, OneToMany, JoinColumn
} from 'typeorm'
import { Exclude, plainToClass } from 'class-transformer'
import {ApiProperty} from '@nestjs/swagger'
import {UserEntity } from './user.entity'

@Entity({
	name: 'ai_account_log',
	orderBy: {
		created_at: 'DESC'
	}
})
export class AccountLogEntity {
	@ApiProperty({ description: 'The _id of the User' })
	@PrimaryGeneratedColumn()
	id: number;
	// basic

	@ApiProperty({ description: 'The uuid of the User' })
	@Column()
    @Generated("uuid")
	uuid: string

	@ApiProperty({ description: '操作类型进或出' })
	@Column({ type: "tinyint", width:1, default:'1',comment:'0.出,1 进'})
	action: boolean

    @Column({ type: "varchar", length: 50,nullable:true})
	action_type: string

    @Column({ type: "int",  default:'0',comment:'发生金额'})
	amount:number

    @Column({ type: "int",  default:'0',comment:'余额'})
	balance:number

    @Column({ type: "int",  default:'0',comment:'关联订单 id'})
	order_id:number

    @Column({ type: "int",  default:'0',comment:'关联任务 id'})
	task_id:number

    @Column({ type: "int",  default:'0',comment:'相关事件 id'})
	event_id:number

    @Column({type:"text",nullable:true})
	params: string

    @Column({type:"text",nullable:true})
	note: string

    @ApiProperty({ description: 'The created_at of the User' })
	@CreateDateColumn()
	created_at: Date

	@ApiProperty({ description: 'The updated_at  of the User' })
	@UpdateDateColumn()
	updated_at: Date

    @ManyToOne(() => UserEntity, user => user.accountLog) // 将另一面指定为第二个参数
    @JoinColumn({ name: "user_id" })
    user: UserEntity;

    @Column({nullable:true})
	user_id: number;


	constructor(partial: Partial<AccountLogEntity>) {
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
