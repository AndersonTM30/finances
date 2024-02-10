import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users.service';
import { UsersModule } from '../../users.module';
import { PrismaService } from '../../../prisma_client/prisma.service';
import { CreateUsersDto } from 'src/users/dto/create.users.dto';

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
    const newUser: CreateUsersDto = {
      username: 'Anderson',
      password: '1234',
    };
    await service.createUser(newUser);
    expect(newUser.username).toEqual('Anderson');
  });

  it('should list a user by username', async () => {
    const user = await service.findByUsername('Anderson');
    expect(user.username).toEqual('Anderson');
  });
});
