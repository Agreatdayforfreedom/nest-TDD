import { Types } from 'mongoose';

export interface User {
	_id: Types.ObjectId | string;
	username: string;
	password?: string;
}
