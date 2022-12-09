import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { User } from '../../../auth/decorators/user.decorator';
import { Public } from '../../../auth/guards/public.guard';
import { CreateProjectDto, UpdateProjectDto } from '../../dtos/project.dto';
import { ProjectService } from '../../services/project/project.service';

@Controller('project')
export class ProjectController {
	constructor(private projectService: ProjectService) {}

	@Post('new')
	create(@Body() payload: CreateProjectDto, @User() user: any) {
		return this.projectService.create(payload, user);
	}

	@Put('update/:id')
	updateOne(
		@Param() _id: string,
		@Body() payload: UpdateProjectDto,
		@User() user,
	) {
		return this.projectService.updateOne(_id, payload, user);
	}

	@Put('update/:id')
	deleteOne(@Param() _id: string, @User() user) {
		return this.projectService.deleteOne(_id, user);
	}
}
