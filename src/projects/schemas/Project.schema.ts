import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../auth/interfaces/interface';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
	@Prop()
	name: string;

	@Prop()
	description: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	user: User;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
