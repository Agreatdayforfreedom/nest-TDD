import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthController } from './auth.controller';
import { Connection, connect, Model, mongo } from 'mongoose';
import { User, UserSchema } from '../../../user/schema/User.schema';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from '../../services/auth/auth.service';
import { FakeUserSub, UserStub } from '../../../common/stubs/user.stub';
import { UserService } from '../../../user/services/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
  CreateMemoryDatabase,
  CreateTestingModule,
} from '../../../common/jest';

describe('AuthController', () => {
  let app: INestApplication;
  let controller: AuthController;
  let authModel: Model<User>;
  let createMemoryDatabase: CreateMemoryDatabase;
  let createTestingModule: CreateTestingModule;

  beforeAll(async () => {
    createMemoryDatabase = new CreateMemoryDatabase();
    createTestingModule = new CreateTestingModule();
    authModel = await createMemoryDatabase.setup<User>(User.name, UserSchema);

    const module = await createTestingModule.setup({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        { provide: getModelToken(User.name), useValue: authModel },
      ],
    });

    controller = module.get<AuthController>(AuthController);

    app = await createTestingModule.initApp();
  });

  afterAll(async () => {
    await createMemoryDatabase.stopDatabase();
  });

  afterEach(async () => {
    await createMemoryDatabase.deleteCollections();
  });

  describe('signup', () => {
    it('should return the saved object and access_token', async () => {
      const signup = await controller.signup(UserStub());
      expect(signup.username).toBe(UserStub().username);
      expect(signup.access_token).toBeDefined();
      expect(signup.access_token.slice(0, 2)).toBe('ey');
    });
    it('should return "user already exists"', async () => {
      await new authModel(UserStub()).save();
      await expect(controller.signup(UserStub())).rejects.toThrow(
        new UnauthorizedException('Username already exists'),
      );
    });
  });

  describe('login', () => {
    it('should return access_token', async () => {
      //signup
      await new authModel(UserStub()).save();

      const login = await controller.login(UserStub());
      expect(login.access_token).toBeDefined();
      expect(login.access_token.slice(0, 2)).toBe('ey');
    });

    it('should respond with "incorrect username or password"', async () => {
      //signup
      await new authModel(UserStub()).save();

      await expect(controller.login(FakeUserSub())).rejects.toThrow(
        new UnauthorizedException('incorrent username or password'),
      );
    });
  });

  describe('profile', () => {
    it('should extract user info from the jwt', async () => {
      await new authModel(UserStub()).save();
      const login = await controller.login(UserStub());

      console.log(login);
      const res = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${login.access_token}`);
      expect(res.statusCode).toBe(200);
    });
  });
});
