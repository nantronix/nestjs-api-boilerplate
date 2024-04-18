import { Entity, ObjectIdColumn, Column,Generated,CreateDateColumn,UpdateDateColumn,PrimaryGeneratedColumn,OneToOne, JoinColumn} from 'typeorm'
import { Exclude, plainToClass } from 'class-transformer'
import {ApiProperty} from '@nestjs/swagger'
import {UserEntity } from './user.entity'

@Entity({
	name: 'ad_user_weixin',
	orderBy: {
		created_at: 'ASC'
	}
})
export class WeixinUserEntity {
	@ApiProperty({ description: 'The id of the weixin User' })
	@PrimaryGeneratedColumn()
	id: number;
	// basic
    
    /*@ApiProperty({ description: 'The user_id of the weixin User' })
    @Column({ type: "int",default:0})
	user_id: number;*/

    @ApiProperty({ description: 'The nick_name of the User' })
	@Column({ type: "varchar", length: 100,nullable:true})
	nickname: string

    @ApiProperty({ description: 'The sex of ther User' })
	@Column({ type: "tinyint", width:1, default:'0',comment:'1 男 2 女'})
	sex:number 

    @ApiProperty({ description: 'The country of the User' })
	@Column({ type: "varchar", length: 100,nullable:true})
	country: string

    @ApiProperty({ description: 'The province of the User' })
	@Column({ type: "varchar", length: 100,nullable:true})
	province: string

    @ApiProperty({ description: 'The province of the User' })
	@Column({ type: "varchar", length: 100,nullable:true})
	city: string

    @ApiProperty({ description: 'The weixin openid of the User' })
	@Column({ type: "varchar", length: 50})
	openid: string

    @ApiProperty({ description: 'The weixin openid of the User' })
	@Column({ type: "varchar", length: 50,nullable:true})
	session_key: string

	@Column({ type: "varchar", length: 50,nullable:true})
	phone_number: string

    @Column({ type: "varchar", length: 50,nullable:true})
	pure_phone_number: string

    @Column({ type: "varchar", length: 50,nullable:true})
	country_code: string

    @ApiProperty({ description: 'The unionid of the User' })
	@Column({ type: "varchar", length: 50,nullable:true})
	unionid: string

	@ApiProperty({ description: 'The avatar of the User' })
	@Column({ type: "varchar", length: 255,nullable:true})
	headimgurl: string

    @ApiProperty({ description: 'The created_at of the User' })
	@CreateDateColumn()
	created_at: Date

	@ApiProperty({ description: 'The updated_at  of the User' })
	@UpdateDateColumn()
	updated_at: Date
    
    @ApiProperty({ description: 'The user_id of the weixin User' })
    @OneToOne(() => UserEntity, user => user.weixinUser) // 将另一面指定为第二个参数
    @JoinColumn({ name: "user_id" })
    user: UserEntity;

    @Column({nullable:true})
	user_id: number;

	constructor(partial: Partial<WeixinUserEntity>) {
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
