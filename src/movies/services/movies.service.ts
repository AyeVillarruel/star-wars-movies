import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from '../entities/movies.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { FavoriteMovieDto } from '../dto/favorite-movie.dto';
import { UserMovie } from '../entities/user_movies.entity';
import { User } from '../../users/users.entity';
import { Starship } from '../entities/starship.entity';
import { Characters } from '../entities/character.entity';
import { Planet } from '../entities/planet.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { Species } from '../entities/Species.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    @InjectRepository(UserMovie)
    private userMoviesRepository: Repository<UserMovie>,
    @InjectRepository(User)  
    private readonly userRepository: Repository<User>,
  ){}

  async findAll(): Promise<Movie[]> {
    return this.moviesRepository.find();
  }

  async findById(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations: ['characters', 'planets', 'starships', 'vehicles', 'species'], 
    });
  
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
  
    return movie;
  }


  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const existingMovie = await this.moviesRepository.findOne({
        where: { title: createMovieDto.title },
    });

    if (existingMovie) {
        throw new ConflictException('A movie with this title already exists');
    }

    const movie = this.moviesRepository.create(createMovieDto);
    return this.moviesRepository.save(movie);
}


  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.moviesRepository.findOne({ where: { id } });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    Object.assign(movie, updateMovieDto); 
    return this.moviesRepository.save(movie);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.moviesRepository.delete(id);
    return result.affected > 0;
  }
  

  async addFavorite(dto: FavoriteMovieDto): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    const movie = await this.moviesRepository.findOne({ where: { id: dto.movieId } });
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${dto.movieId} not found`);
    }

    const exists = await this.userMoviesRepository.findOne({
      where: { user, movie },
    });

    if (exists) {
      return 'Movie is already in favorites';
    }

    const favorite = this.userMoviesRepository.create({ user, movie });
    await this.userMoviesRepository.save(favorite);
    return 'Movie added to favorites';
  }

  async removeFavorite(dto: FavoriteMovieDto): Promise<string> {
    const favorite = await this.userMoviesRepository.findOne({
      where: { user: { id: dto.userId }, movie: { id: dto.movieId } }, 
      relations: ['user', 'movie'],
    });
  
    if (!favorite) {
      return 'Movie was not in favorites';
    }
  
    const deleted = await this.userMoviesRepository.delete(favorite.id);
    
    if (deleted.affected === 0) {
      return 'Movie was not in favorites';
    }
  
    return 'Movie removed from favorites';
  }
  
  async getUserFavorites(userId: number): Promise<UserMovie[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.userMoviesRepository.find({
      where: { user },
      relations: ['movie'],
    });
  }

  async getCharactersByMovie(id: number): Promise<Characters[]> {
    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations: ['characters'], 
    });
  
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
  
    return movie.characters;
  }

  async getStarshipsByMovie(id: number): Promise<Starship[]> {
    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations: ['starships'], 
    });
  
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
  
    return movie.starships;
  }

  async getPlanetsByMovie(id: number): Promise<Planet[]> {
    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations: ['planets'], 
    });
  
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
  
    return movie.starships;
  }
  async getVehicleByMovie(id: number): Promise<Vehicle[]> {
    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations: ['vehicles'], 
    });
  
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
  
    return movie.starships;
  }
  async getSpeciesByMovie(id: number): Promise<Species[]> {
    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations: ['species'], 
    });
  
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
  
    return movie.starships;
  }
  
  
  
}
 

