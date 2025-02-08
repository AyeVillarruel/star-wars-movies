import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Movie } from '../entities/movies.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserMovie } from '../entities/user_movies.entity';
import { User } from '../../users/users.entity';

const mockMovie = Object.assign(new Movie(), {
  id: 1,
  title: 'A New Hope',
  description: 'Star Wars original movie',
  director: 'George Lucas',
  producer: 'Lucasfilm',
  releaseDate: '1977-05-25',
  movieUsers: [], 
});

const mockUser = Object.assign(new User(), {
  id: 1,
  email: 'test@example.com',
  role: 'REGULAR',
  userMovies: [], 
});

const mockUserMovie = Object.assign(new UserMovie(), {
  id: 1,
  user: mockUser,
  movie: mockMovie,
  created_at: new Date(),
});

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: Repository<Movie>;
  let userMovieRepository: Repository<UserMovie>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: {
            find: jest.fn().mockResolvedValue([mockMovie]),
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockReturnValue(mockMovie),
            save: jest.fn().mockResolvedValue(mockMovie),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: getRepositoryToken(UserMovie), 
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockReturnValue(mockUserMovie),
            save: jest.fn().mockResolvedValue(mockUserMovie),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: getRepositoryToken(User),  
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    userMovieRepository = module.get<Repository<UserMovie>>(getRepositoryToken(UserMovie));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('Debe retornar todas las películas', async () => {
    expect(await service.findAll()).toEqual([mockMovie]);
  });

  it('Debe retornar una película por ID', async () => {
    jest.spyOn(movieRepository, 'findOne').mockResolvedValue(Object.assign(new Movie(), mockMovie));
    expect(await service.findById(1)).toEqual(mockMovie);
  });

  it('Debe crear una película', async () => {
    expect(await service.create(mockMovie)).toEqual(mockMovie);
  });

  it('Debe lanzar un error si el título de la película ya existe', async () => {
    jest.spyOn(movieRepository, 'findOne').mockResolvedValue(Object.assign(new Movie(), mockMovie));

    await expect(service.create(mockMovie)).rejects.toThrow(ConflictException);
  });

  it('Debe actualizar una película', async () => {
    jest.spyOn(movieRepository, 'findOne').mockResolvedValue(Object.assign(new Movie(), mockMovie));
    expect(await service.update(1, mockMovie)).toEqual(mockMovie);
  });

  it('Debe eliminar una película', async () => {
    jest.spyOn(movieRepository, 'delete').mockResolvedValue({ affected: 1 } as any);
    await expect(service.remove(1)).resolves.toBe(true);
  });
  it('Debe agregar una película a favoritos', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
    jest.spyOn(movieRepository, 'findOne').mockResolvedValue(mockMovie as Movie);
    jest.spyOn(userMovieRepository, 'findOne').mockResolvedValue(null); 
    jest.spyOn(userMovieRepository, 'create').mockReturnValue(mockUserMovie as UserMovie);
    jest.spyOn(userMovieRepository, 'save').mockResolvedValue(mockUserMovie as UserMovie);
  
    const result = await service.addFavorite({ userId: 1, movieId: 1 });
    expect(result).toBe('Movie added to favorites');
  });
  

  it('Debe lanzar error si el usuario no existe', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    await expect(service.addFavorite({ userId: 1, movieId: 1 })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Debe lanzar error si la película no existe', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
    jest.spyOn(movieRepository, 'findOne').mockResolvedValue(null);

    await expect(service.addFavorite({ userId: 1, movieId: 1 })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Debe eliminar una película de favoritos', async () => {
    jest.spyOn(userMovieRepository, 'findOne').mockResolvedValue(mockUserMovie); 
    jest.spyOn(userMovieRepository, 'delete').mockResolvedValue({ affected: 1 ,raw:{}});
  
    const result = await service.removeFavorite({ userId: 1, movieId: 1 });
    expect(result).toBe('Movie removed from favorites');
  });
  

  it('Debe devolver mensaje si la película no estaba en favoritos', async () => {
    jest.spyOn(userMovieRepository, 'delete').mockResolvedValue({ affected: 0 } as any);

    const result = await service.removeFavorite({ userId: 1, movieId: 1 });
    expect(result).toBe('Movie was not in favorites');
  });
});
