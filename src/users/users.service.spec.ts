import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersModule } from './users.module';
import { PrismaService } from '../prisma_client/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a new user', async () => {
    const newUser = await service.createUser({
      username: 'Anderson',
      password: '1234',
    });
    expect(newUser.username).toEqual('Anderson');
  });
});
