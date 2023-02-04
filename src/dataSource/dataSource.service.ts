import { Injectable } from '@nestjs/common';
import { IUsers, User } from '../users/users.interface';
import { CreateUserDto } from '../users/users.dto';

@Injectable()
export class DataSourceService {
  private users: IUsers = {}

  public async findAll(): Promise<any[]> {
    return Object.values(this.users)
  }

  public async createUser(data: User): Promise<any> {
    this.users[data.id] = data;

    return data
  }

  public async findByID(id: string): Promise<any> {
    return this.users[id]
  }

  public async updateByID(id: string, data: any): Promise<any> {
    const user = this.users[id];

    this.users[id] = {
      ...user,
      ...data,
      version: ++user.version,
      updatedAt: Date.now()
    }

    return this.users[id]
  }

  public async deleteByID(id: string): Promise<boolean> {
    return delete this.users[id]
  }
}
