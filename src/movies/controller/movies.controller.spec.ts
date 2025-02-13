import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from '../services/movies.service';
import { Movie } from '../entities/movies.entity';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { FavoriteMovieDto } from '../dto/favorite-movie.dto';
import { Planet } from '../entities/planet.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { Species } from '../entities/Species.entity';
import { Starship } from '../entities/starship.entity';
import { Characters } from '../entities/character.entity';
import { UserMovie } from '../entities/user_movies.entity';

const mockMovie = Object.assign(new Movie(), {
  id: 1,
  title: 'A New Hope',
  description: 'Star Wars original movie',
  director: 'George Lucas',
  producer: 'Lucasfilm',
  releaseDate: '1977-05-25',
});

const mockFavoriteMovieDto: FavoriteMovieDto = {
  userId: 1,
  movieId: 1,
};

const mockUserMovie = Object.assign(new UserMovie(), {
  id: 1,
  user: { id: 1, email: 'test@example.com' },
  movie: mockMovie, 
  created_at: new Date(), 
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
            getUserFavorites: jest.fn().mockResolvedValue([mockMovie]),
            addFavorite: jest.fn().mockResolvedValue('Movie added to favorites'),
            removeFavorite: jest.fn().mockResolvedValue('Movie removed from favorites'),
            getCharactersByMovie: jest.fn().mockResolvedValue([new Characters()]),
            getStarshipsByMovie: jest.fn().mockResolvedValue([new Starship()]),
            getPlanetsByMovie: jest.fn().mockResolvedValue([new Planet()]),
            getVehicleByMovie: jest.fn().mockResolvedValue([new Vehicle()]),
            getSpeciesByMovie: jest.fn().mockResolvedValue([new Species()]),
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
    const result = await controller.create(mockMovie);
    expect(result).toEqual(mockMovie); 
  });
  

  it('Debe lanzar un error si no se encuentra la película al actualizar', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue(null);    
    await expect(controller.update(1, mockMovie)).rejects.toThrow(
      new NotFoundException(`Movie with ID 1 not found`)
    );
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

  it('Debe agregar una película a favoritos', async () => {
    const mockReq = { user: { id: 1 } };
    jest.spyOn(service, 'addFavorite').mockResolvedValue('Movie added to favorites');  
    const result = await controller.addFavorite(mockReq, { movieId: 1 });
    expect(result).toBe('Movie added to favorites');
  });
  
  

  it('Debe eliminar una película de favoritos', async () => {  
    jest.spyOn(service, 'removeFavorite').mockResolvedValue('Movie removed from favorites');  
    const req = { user: { id: 1 } }; 
    const movieId = 1; 
        expect(await controller.removeFavorite(req, movieId)).toBe('Movie removed from favorites');
  });
    
  it('Debe devolver los favoritos del usuario', async () => {
    jest.spyOn(service, 'getUserFavorites').mockResolvedValue([mockUserMovie]);  
    const req = { user: { id: 1 } }; 
    expect(await controller.getUserFavorites(req)).toEqual([mockUserMovie]);
  });
  
  it('Debe devolver los personajes de una película', async () => {
    jest.spyOn(service, 'getCharactersByMovie').mockResolvedValue([new Characters()]);
    const result = await controller.getCharactersByMovie(2);
    expect(result).toEqual([new Characters()]);
  });
  
  it('Debe devolver las naves espaciales de una película', async () => {
    jest.spyOn(service, 'getStarshipsByMovie').mockResolvedValue([new Starship()]);
    const result = await controller.getStarshipsByMovie(2);
    expect(result).toEqual([new Starship()]);
  });
  
  it('Debe devolver los planetas de una película', async () => {
    jest.spyOn(service, 'getPlanetsByMovie').mockResolvedValue([new Planet()]);
    const result = await controller.getPlanetsByMovie(2);
    expect(result).toEqual([new Planet()]);
  });
  
  it('Debe devolver los vehículos de una película', async () => {
    jest.spyOn(service, 'getVehicleByMovie').mockResolvedValue([new Vehicle()]);
    const result = await controller.getVehiclesByMovie(2);  
    expect(result).toEqual([new Vehicle()]);
  });
  
  it('Debe devolver las especies de una película', async () => {
    jest.spyOn(service, 'getSpeciesByMovie').mockResolvedValue([new Species()]);
    const result = await controller.getSpeciesByMovie(2);
    expect(result).toEqual([new Species()]);
  });  
});
