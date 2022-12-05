import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../../schema/User.schema';

describe('UserService', () => {
  let service: UserService;

  let username: string = 'jose';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: jest.fn(),
        },
      ],
    }).compile();

    service = await module.resolve<UserService>(UserService);
  });

  it('should be defined', async () => {
    // console.log(findOne);
    expect(await service.findOne({ payload: { username } })).toBeDefined();
  });
});
