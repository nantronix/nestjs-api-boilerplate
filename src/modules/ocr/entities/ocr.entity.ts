import {
	Entity,
	ObjectIdColumn,
	Column,
	Generated,
	CreateDateColumn,
	UpdateDateColumn,
	PrimaryGeneratedColumn,
	OneToMany
} from 'typeorm'
import { Exclude, plainToClass } from 'class-transformer'
import {ApiProperty} from '@nestjs/swagger'
import { OcrFilesEntity } from './ocr_files.entity'

@Entity({
	name: 'mmx_ocr',
	orderBy: {
		id: 'ASC'
	}
})

export class OcrEntity {
	@ApiProperty({ description: 'The _id of the OCR' })
	@PrimaryGeneratedColumn()
	id: number;
	// basic

	@ApiProperty({ description: 'The uuid of the OCR' })
	@Column()
    @Generated("uuid")
	uuid: string

    //status 0:未处理，1：已处理, 2:处理失败
    @ApiProperty({ description: 'The status of the OCR' })
    @Column({ type: "tinyint", width:1, default:'0'})
    status: boolean

    //文件数量
    @ApiProperty({ description: 'The file_count of the OCR' })
    @Column({ type: "int",  default:'0'})
    file_count: number

    //处理成功文件数量
    @ApiProperty({ description: 'The file_success of the OCR' })
    @Column({ type: "int",  default:'0'})
    file_success: number

    //处理结果备注
    @ApiProperty({ description: 'The remark of the OCR' })
    @Column({ type: "varchar", length: 255,nullable:true })
    remark: string


    @ApiProperty({ description: 'The created_at of the OCR' })
	@CreateDateColumn()
	created_at: Date

	@ApiProperty({ description: 'The updated_at  of the OCR' })
	@UpdateDateColumn()
	updated_at: Date

    @OneToMany(type => OcrFilesEntity, files => files.ocr)
    files: OcrFilesEntity[]


	constructor(partial: Partial<OcrEntity>) {
        if (partial) {
            Object.assign(this, partial)
            this.updated_at = new Date()
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

