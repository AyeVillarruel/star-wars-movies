import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from '../services/movies.service';
import { Movie } from '../entities/movies.entity';
import { JwtService } from '@nestjs/jwt';

const mockMovie = Object.assign(new Movie(), {
  id: 1,
  title: 'A New Hope',
  description: 'Star Wars original movie',
  director: 'George Lucas',
  producer: 'Lucasfilm',
  releaseDate: '1977-05-25',
});

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
          findAll: jest.fn().mockResolvedValue([mockMovie]),
          findById: jest.fn().mockResolvedValue(mockMovie),
          create: jest.fn().mockResolvedValue(mockMovie),
          update: jest.fn().mockResolvedValue(mockMovie),
          remove: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
            verify: jest.fn().mockReturnValue({ sub: 1, email: 'test@example.com', role: 'ADMIN' }),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('Debe retornar todas las películas', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([mockMovie]);

    expect(await controller.findAll()).toEqual([mockMovie]);
});

  it('Debe retornar una película por ID', async () => {
    expect(await controller.findOne(1)).toEqual(mockMovie);
  });

  it('Debe crear una película', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(mockMovie);
    expect(await controller.create(mockMovie)).toEqual(mockMovie);
  });
  

  it('Debe actualizar una película', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue(mockMovie);
    jest.spyOn(service, 'update').mockResolvedValue(mockMovie);
    
    expect(await controller.update(1, mockMovie)).toEqual(mockMovie);
  });
  

  it('Debe eliminar una película', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue(mockMovie);
    jest.spyOn(service, 'remove').mockResolvedValue(true);
  
    expect(await controller.delete(1)).toEqual({ message: `Movie with ID 1 has been deleted` });
  });
  
});
