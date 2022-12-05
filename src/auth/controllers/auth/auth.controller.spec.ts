import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthController } from './auth.controller';
import { Connection, connect, Model, mongo } from 'mongoose';
import { User, UserSchema } from '../../../user/schema/User.schema';
import { getModelToken } from '@nestjs/mongoose';
import { AuthService } from '../../services/auth/auth.service';
import { FakeUserSub, UserStub } from '../../../../test/stubs/user.stub';
import { UserService } from '../../../user/services/user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('AuthController', () => {
  let app: INestApplication;
  let controller: AuthController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let authModel: Model<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    authModel = mongoConnection.model(User.name, UserSchema);
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        // JwtService,
        { provide: getModelToken(User.name), useValue: authModel },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
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
