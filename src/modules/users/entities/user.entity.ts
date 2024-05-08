import {
  Entity,
  ObjectIdColumn,
  Column,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Exclude, plainToClass } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AccountLogEntity } from './account_log.entity';
import { UserGroupEntity } from './user_group.entity';

@Entity({
  name: 'ad_user',
  orderBy: {
    created_at: 'ASC',
  },
})
export class UserEntity {
  @ApiProperty({ description: 'The _id of the User' })
  @PrimaryGeneratedColumn()
  id: number;
  // basic

  @ApiProperty({ description: 'The uuid of the User' })
  @Column()
  @Generated('uuid')
  uuid: string;

  @ApiProperty({ description: 'The name of the User' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The user_name of the User' })
  @Column()
  user_name: string;

  @ApiProperty({ description: 'The email of the User' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @ApiProperty({ description: 'The country of the User' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @ApiProperty({ description: 'The province of the User' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  province: string;

  @ApiProperty({ description: 'The province of the User' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @ApiProperty({ description: 'The province of the User' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  district: string;

  @ApiProperty({ description: 'The province of the User' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @ApiProperty({ description: 'The password of the User' })
  @Column({ type: 'varchar', length: 50, select: false, nullable: true })
  password: string;

  @ApiProperty({ description: 'The gender of ther User' })
  @Column({
    type: 'tinyint',
    width: 1,
    default: '0',
    comment: '0 male 1,female 2 other',
  })
  gender: number;

  @ApiProperty({ description: 'The avatar of the User' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  avatar: string;

  @ApiProperty({ description: 'The phone of the User' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string;

  @ApiProperty({ description: 'The verified of the User' })
  @Column({ type: 'tinyint', width: 1, default: '0' })
  verified: boolean;

  @Column({
    type: 'tinyint',
    width: 1,
    default: '0',
    comment: '0.nomarl,1,vip',
  })
  is_vip: number;

  @Column({ type: 'int', default: '0', comment: '推荐人ID' })
  feature_id: number;

  @Column({
    type: 'tinyint',
    width: 1,
    default: '0',
    comment: '0.weapp,1.tt,2.ios',
  })
  client: number;

  @Column({ type: 'int', default: '0', comment: 'account' })
  account: number;

  //钻石兑换点数
  @Column({ type: 'int', default: '0', comment: '钻石兑换点数' })
  point: number;

  @Column({ type: 'tinyint', width: 1, default: '0', comment: '测试用户' })
  is_test: number;

  @ApiProperty({ description: '开始时间', nullable: true })
  @Column({
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  start_date: Date;

  @ApiProperty({ description: '结束时间', nullable: true })
  @Column({ type: 'datetime', nullable: true })
  end_date: Date;

  @Column({type:'text',nullable:true})
  note:string

  @ApiProperty({ description: 'The created_at of the User' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'The updated_at  of the User' })
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => AccountLogEntity, (accountLog) => accountLog.user) // 将另一面指定为第二个参数
  accountLog: AccountLogEntity;

  @ManyToOne(() => UserGroupEntity, (group) => group.user) // 将另一面指定为第二个参数
  @JoinColumn({ name: 'group_id' })
  group: UserGroupEntity;

  @Column({ nullable: true, default: 1 })
  group_id: number;

  constructor(partial: Partial<UserEntity>) {
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
