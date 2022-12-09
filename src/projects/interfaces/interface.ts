import { Types } from 'mongoose';

export interface Project {
	_id: Types.ObjectId;
	name: string;
	description: string;
	user: Types.ObjectId;
}
