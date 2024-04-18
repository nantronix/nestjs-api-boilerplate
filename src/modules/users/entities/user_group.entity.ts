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
import { UserEntity } from './user.entity';

@Entity({
  name: 'ad_user_group',
  orderBy: {
    id: 'ASC',
  },
})
export class UserGroupEntity {
  @ApiProperty({ description: 'The _id of the User' })
  @PrimaryGeneratedColumn()
  id: number;
  // basic

  @Column({ default: '0' })
  parent_id: number;

  @ApiProperty({ description: 'title' })
  @Column()
  title: string;

  @ApiProperty({ description: 'name' })
  @Column()
  name: string;

  //status

  @ApiProperty({ description: 'params' })
  @Column({ type: 'json', nullable: true })
  params: any;

  @OneToMany(() => UserEntity, (user) => user.group) // 将另一面指定为第二个参数
  user: UserEntity;

  constructor(partial: Partial<UserGroupEntity>) {
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
