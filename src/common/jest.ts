import {
  CanActivate,
  ExecutionContext,
  INestApplication,
} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model, Schema } from 'mongoose';
import { AuthController } from '../auth/controllers/auth/auth.controller';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

export const mockMongooseMethods = {
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
  exec: jest.fn(),
};

export class CreateMemoryDatabase {
  mongod: MongoMemoryServer;
  mongoConnection: Connection;
  uri: string;

  async setup<T>(name: string, schema: Schema<T>) {
    this.mongod = await MongoMemoryServer.create();
    this.uri = this.mongod.getUri();

    this.mongoConnection = (await connect(this.uri)).connection;
    return this.mongoConnection.model(name, schema);
  }

  async stopDatabase() {
    await this.mongoConnection.dropDatabase();
    await this.mongoConnection.close();
    await this.mongod.stop();
  }

  async deleteCollections() {
    const collections = this.mongoConnection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
}

export class CreateTestingModule {
  private _module: TestingModule;

  async setup(injections: any) {
    const providers = injections.providers ?? [];
    const controllers = injections.controllers ?? [];
    const modules = injections.modules ?? [];

    const module = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' }), ...modules],
      controllers,
      providers,
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtGuard)
      .compile();
    this._module = module;
    return module;
  }

  async initApp() {
    const app: INestApplication = this._module.createNestApplication();
    await app.init();
    return app;
  }
}

class MockJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    req.user = { _id: 'objectid', username: 'some' };
    return req.user;
  }
}
