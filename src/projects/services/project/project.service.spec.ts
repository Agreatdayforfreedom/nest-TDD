import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CreateTestingModule, mockMongooseMethods } from '../../../common/jest';
import { User, UserDocument } from '../../../user/schema/User.schema';
import { ProjectsModule } from '../../projects.module';
import { Project, ProjectDocument } from '../../schemas/Project.schema';
import { ProjectService } from './project.service';

const mockProject = (
  name = 'Ventus',
  _id = 'a uuid',
  description = 'pass',
  user = 'id',
) => ({
  name,
  _id,
  description,
  user,
});

describe('ProjectService', () => {
  let service: ProjectService;
  let createTestingModule: CreateTestingModule;
  let model: Model<ProjectDocument>;

  beforeAll(async () => {
    createTestingModule = new CreateTestingModule();
    const module = await createTestingModule.setup({
      providers: [
        ProjectService,
        {
          provide: getModelToken(Project.name),
          useValue: mockMongooseMethods,
        },
      ],
    });

    service = module.get<ProjectService>(ProjectService);
    model = module.get<Model<ProjectDocument>>(getModelToken(Project.name));

    // await createTestingModule.initApp();
  });

  it('should insert a new project', async () => {
    jest.spyOn(model, 'create').mockImplementation((project: any) =>
      Promise.resolve({
        ...project,
      }),
    );

    const newProject = await service.create(
      {
        name: 'project1',
        _id: 'a uuid',
        description: 'pass',
      },
      {
        user: 'someid',
      },
    );
    expect(newProject).toEqual(
      mockProject('project1', 'a uuid', 'pass', 'someid'),
    );
  });
});
