import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schema/User.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(payload: any) {
    return await this.userModel.create(payload);
  }

  async findOne(payload: any) {
    return await this.userModel.findOne({ username: payload.username });
  }
}
