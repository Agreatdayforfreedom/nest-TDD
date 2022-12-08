import { Body, Controller } from '@nestjs/common';
import { User } from '../../../auth/decorators/user.decorator';
import { Public } from '../../../auth/guards/public.guard';
import { ProjectService } from '../../services/project/project.service';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Public()
  create(@Body() payload: any, @User() user: any) {
    // console.log('user', user);
    return this.projectService.create(payload, user);
  }
}
