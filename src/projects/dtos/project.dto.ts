import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from '../../auth/interfaces/interface';

export class CreateProjectDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsNotEmpty()
	user: User | string;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
