import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  BeforeUpdate
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  login: string;

  @Column()
  @Exclude()
  password: string;

  @VersionColumn()
  version!: number;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)"
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updatedAt: Date;

  constructor(args) {
    Object.assign(this, args)
  }
}
