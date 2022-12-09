import { getModelToken } from '@nestjs/mongoose';
import {
	CallbackWithoutResult,
	Document,
	FilterQuery,
	Model,
	Query,
} from 'mongoose';
import { CreateTestingModule, mockMongooseMethods } from '../../../common/jest';
import { mockProject } from '../../../common/__mocks__';
import { Project, ProjectDocument } from '../../schemas/Project.schema';
import { Project as IProject } from '../../interfaces/interface';
import { ProjectService } from './project.service';

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
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should insert a new project', async () => {
		jest.spyOn(model, 'create').mockImplementation((project: IProject) =>
			Promise.resolve({
				_id: 'someid',
				...project,
			}),
		);

		const newProject = await service.create(
			{
				name: 'project1',
				description: 'pass',
			},
			{
				user: 'userId',
			},
		);
		expect(newProject).toEqual(
			mockProject('someid', 'project1', 'pass', 'userId'),
		);
	});

	it('should edit the project', async () => {
		jest
			.spyOn(model, 'findByIdAndUpdate')
			.mockImplementation((_id: any, project: any): any =>
				Promise.resolve({
					_id,
					...project,
				}),
			);
		let _id: string = '1';

		const updateProject = await service.updateOne(
			_id,
			{
				name: 'project2',
				description: 'hello i am the description',
				user: 'userId',
			},
			{
				user: 'userId',
			},
		);
		expect(updateProject).toStrictEqual(
			mockProject('1', 'project2', 'hello i am the description', 'userId'),
		);
	});

	describe('delete', () => {
		it('should delete the project', async () => {
			jest
				.spyOn(model, 'deleteOne')
				.mockImplementationOnce((_id: CallbackWithoutResult): any => {
					Promise.resolve({
						deleted: true,
					});
				});
			let _id: string = '1';

			expect(await service.deleteOne(_id, { user: 'userId' })).toEqual({
				deleted: true,
			});
		});
	});
});
