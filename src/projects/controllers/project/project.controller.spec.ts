import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { ObjectId } from 'mongoose';
import { User } from '../../../auth/interfaces/interface';
import {
	CreateMemoryDatabase,
	CreateTestingModule,
} from '../../../common/jest';
import { CreateProjectDto, UpdateProjectDto } from '../../dtos/project.dto';
import { ProjectService } from '../../services/project/project.service';
import { ProjectController } from './project.controller';

describe('ProjectController', () => {
	let controller: ProjectController;
	let service: ProjectService;
	let createMemoryDatabase: CreateMemoryDatabase;
	let createTestingModule: CreateTestingModule;
	const user: User = {
		//request
		_id: '1',
		username: 'aaaa',
	};

	let mockProjectService = {
		create: jest.fn((project) => {
			return {
				_id: '1',
				...project,
			};
		}),
		updateOne: jest.fn((_id, project) => {
			return {
				_id,
				...project,
			};
		}),
		deleteOne: jest.fn().mockResolvedValue({ deleted: true }),
	};

	afterEach(() => {
		jest.restoreAllMocks();
	});

	beforeAll(async () => {
		createMemoryDatabase = new CreateMemoryDatabase();
		createTestingModule = new CreateTestingModule();

		const module: TestingModule = await createTestingModule.setup({
			controllers: [ProjectController],
			providers: [
				JwtService,
				{
					provide: ProjectService,
					useValue: mockProjectService,
				},
			],
		});

		controller = module.get<ProjectController>(ProjectController);
		service = module.get<ProjectService>(ProjectService);
	});

	describe('create project [POST]', () => {
		it('should return the object created', () => {
			const createProjectDto: CreateProjectDto = {
				name: 'project1',
				description: 'project desc',
				user,
			};

			expect(controller.create(createProjectDto, user)).toStrictEqual({
				_id: '1',
				...createProjectDto,
			});
		});
	});

	describe('update project [PUT]', () => {
		it('should uptade the document', async () => {
			const updateProjectDto: UpdateProjectDto = {
				name: 'project2',
				description: 'project desc',
				user: user._id as string,
			};
			let _id: string = '1';
			expect(controller.updateOne(_id, updateProjectDto, user)).toEqual({
				_id,
				...updateProjectDto,
			});
		});
	});

	describe('delete project [DELETE]', () => {
		it('should remove a document', () => {
			const _id: string = '1';

			expect(controller.deleteOne(_id, user)).resolves.toEqual({
				deleted: true,
			});
		});

		it('should not remove a document', () => {
			const deleteSpy = jest
				.spyOn(service, 'deleteOne')
				.mockResolvedValueOnce({ deleted: false });

			const _id: string = 'wrong id';
			expect(controller.deleteOne(_id, user)).resolves.toEqual({
				deleted: false,
			});
			expect(deleteSpy).toBeCalledWith(_id, user);
		});
	});
});
