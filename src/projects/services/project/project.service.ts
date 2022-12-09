import {
	HttpException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UpdateProjectDto } from '../../dtos/project.dto';
import { Project, ProjectDocument } from '../../schemas/Project.schema';

@Injectable()
export class ProjectService {
	constructor(
		@InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
	) {}

	async create(payload: any, user: any) {
		return await this.projectModel.create({ ...payload, ...user });
	}

	async updateOne(_id: string, payload: UpdateProjectDto, user: any) {
		return await this.projectModel.findByIdAndUpdate(_id, payload);

		// const project = await this.projectModel.findOne({ _id });

		// if (!project) throw new HttpException('Project not found', 404);

		// if (project.user._id.toString() !== user._id)
		// 	throw new UnauthorizedException('Permission denied');
	}

	async deleteOne(_id: string, user: any) {
		try {
			await this.projectModel.deleteOne({ _id });

			return { deleted: true };
		} catch (error) {
			return { deleted: false, error: error.message };
		}
	}
}
