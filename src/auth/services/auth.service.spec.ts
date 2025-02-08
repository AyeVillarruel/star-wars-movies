import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';


const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: bcrypt.hashSync('testPassword', 8),
  role: 'ADMIN',
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockJwtToken'),
          },
        },
        {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockReturnValue('mockSecretKey'),
            },
          },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('Debe validar a un usuario y retornar su data sin la contraseña', async () => {
    const user = await service.validateUser('test@example.com', 'testPassword');
    expect(user).toHaveProperty('email', 'test@example.com');
  });

  it('Debe generar un JWT válido', async () => {
    const token = await service.login({ email: 'test@example.com', password: 'testPassword' });
    expect(token).toEqual({ access_token: 'mockJwtToken' });
  });
});
