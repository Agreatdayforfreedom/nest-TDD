import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateMemoryDatabase,
  CreateTestingModule,
} from '../../../common/jest';
import { ProjectService } from '../../services/project/project.service';
import { ProjectController } from './project.controller';

describe('ProjectController', () => {
  let controller: ProjectController;
  let service: ProjectService;
  let createMemoryDatabase: CreateMemoryDatabase;
  let createTestingModule: CreateTestingModule;
  beforeAll(async () => {
    createMemoryDatabase = new CreateMemoryDatabase();
    createTestingModule = new CreateTestingModule();

    const module: TestingModule = await createTestingModule.setup({
      controllers: [ProjectController],
      providers: [
        JwtService,
        {
          provide: ProjectService,
          useValue: {
            create: jest.fn((project) => {
              return {
                _id: '1',
                ...project,
              };
            }),
          },
        },
        // { provide: getModelToken(Project.name), useValue: projectModel },
      ],
    });

    // await createMemoryDatabase.setup(Project.name, ProjectSchema);
    controller = module.get<ProjectController>(ProjectController);
    service = module.get<ProjectService>(ProjectService);
    await createTestingModule.initApp();
  });

  describe('create project [POST]', () => {
    it('should return the object created', () => {
      const createProjectDto = {
        name: 'project1',
        description: 'project desc',
      };

      const userReq = {
        username: 'aaaa',
        _id: '123',
      };
      expect(controller.create(createProjectDto, userReq)).toHaveProperty(
        '_id',
      );
    });
  });
});
