import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  VersionColumn,
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

  @Column('bigint',
    {
      default: +(Date.now().valueOf()),
      transformer: {
        to() {
          return new Date().valueOf();
        },
        from(value) {
          return +value;
        }
      },
    },
  )
  createdAt: number;

  @Column('bigint',
    {
      default: +(Date.now().valueOf()),
      transformer: {
        to(value) {
          return value ? +value : new Date().valueOf();
        },
        from(value) {
          return +value;
        }
      },
    })
  updatedAt: number;

  constructor(args) {
    Object.assign(this, args)
  }
}
