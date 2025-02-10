import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '../movies/entities/movies.entity';
import { Character } from '../movies/entities/character.entity';
import { Planet } from '../movies/entities/planet.entity';
import { Starship } from '../movies/entities/starship.entity';
import { Vehicle } from '../movies/entities/vehicle.entity';
import { Species } from '../movies/entities/Species.entity';
import axios from 'axios';

@Injectable()
export class SyncMoviesCron implements OnModuleInit {
  constructor(
    @InjectRepository(Movie) private readonly moviesRepository: Repository<Movie>,
    @InjectRepository(Character) private readonly charactersRepository: Repository<Character>,
    @InjectRepository(Planet) private readonly planetsRepository: Repository<Planet>,
    @InjectRepository(Starship) private readonly starshipsRepository: Repository<Starship>,
    @InjectRepository(Vehicle) private readonly vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(Species) private readonly speciesRepository: Repository<Species>,
  ) {}

  // Ejecutar sincronización al iniciar la aplicación
  async onModuleInit() {
    console.log('Sincronizando películas al iniciar la aplicación...');
    await this.syncMovies();
  }

  @Cron('0 0 * * *') // Se ejecuta automáticamente cada medianoche
  async syncMovies() {
    console.log('Sincronizando películas desde la API de Star Wars...');

    try {
      const response = await axios.get('https://swapi.dev/api/films/');
      const movies = response.data.results;

      for (const movieData of movies) {
        let movie = await this.moviesRepository.findOne({ where: { title: movieData.title }, relations: ["characters", "planets", "starships", "vehicles", "species"] });

        if (!movie) {
          movie = this.moviesRepository.create({
            title: movieData.title,
            description: movieData.opening_crawl,
            releaseDate: movieData.release_date,
            director: movieData.director,
            producer: movieData.producer,
          });
        }

        movie.characters = await this.getOrCreateEntities(this.charactersRepository, movieData.characters);
        movie.planets = await this.getOrCreateEntities(this.planetsRepository, movieData.planets);
        movie.starships = await this.getOrCreateEntities(this.starshipsRepository, movieData.starships);
        movie.vehicles = await this.getOrCreateEntities(this.vehiclesRepository, movieData.vehicles);
        movie.species = await this.getOrCreateEntities(this.speciesRepository, movieData.species);

        await this.moviesRepository.save(movie);
        console.log(`Película sincronizada: ${movie.title}`);
      }

      console.log('Sincronización de películas completada.');
    } catch (error) {
      console.error('Error en la sincronización:', error.message);
    }
  }

  private async getOrCreateEntities<T extends { name: string; url: string }>(
    repository: Repository<T>,
    urls: string[]
  ): Promise<T[]> {
    const entities: T[] = [];
  
    for (const url of urls) {
      let existingEntity = await repository.findOne({ where: { url } as FindOptionsWhere<T> });
  
      if (!existingEntity) {
        const entityName = url.split('/').slice(-2, -1)[0]; // Obtiene el nombre de la URL
        existingEntity = repository.create({ name: entityName, url } as DeepPartial<T>);
        await repository.save(existingEntity);
      }
  
      entities.push(existingEntity);
    }
  
    return entities;
  }
  
}

