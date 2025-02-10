import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from '../movies/entities/movies.entity';
import { Characters } from '../movies/entities/character.entity';
import { Planet } from '../movies/entities/planet.entity';
import { Starship } from '../movies/entities/starship.entity';
import { Vehicle } from '../movies/entities/vehicle.entity';
import { Species } from '../movies/entities/Species.entity';
import axios from 'axios';
import { response } from 'express';

@Injectable()
export class SyncMoviesCron implements OnModuleInit {
  constructor(
    @InjectRepository(Movie) private readonly moviesRepository: Repository<Movie>,
    @InjectRepository(Characters) private readonly charactersRepository: Repository<Characters>,
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

  private async fetchEntityData(url: string): Promise<{ name: string; url: string }> {
    try {
      const response = await axios.get(url);
      return { name: response.data.name, url: response.data.url };
    } catch (error) {
      console.error(`❌ Error obteniendo datos de ${url}:`, error.message);
      return { name: 'Unknown', url }; // Si la API falla, devolvemos 'Unknown'
    }
  }

  private async syncRelatedEntities<T extends { name: string; url: string }>(
    entityRepository: Repository<T>,
    urls: string[]
  ): Promise<T[]> {
    const entities: T[] = [];

    for (const url of urls) {
      let existingEntity = await entityRepository.findOne({ where: { url } as FindOptionsWhere<T> });

      if (!existingEntity) {
        const entityData = await this.fetchEntityData(url); 

        existingEntity = entityRepository.create({
          name: entityData.name, 
          url: entityData.url,
        } as T);

        await entityRepository.save(existingEntity);
        console.log(`Guardado: ${entityData.name}`);
      }

      entities.push(existingEntity);
    }

    return entities;
  }

  @Cron('0 0 * * *') // Se ejecuta todos los días a medianoche
async syncMovies() {
  console.log('Sincronizando películas desde la API de Star Wars...');

  try {
    const response = await axios.get('https://swapi.dev/api/films/');
    const movies = response.data.results;

    for (const movieData of movies) {
      const movie = new Movie();
      movie.id = movieData.episode_id;
      movie.title = movieData.title;
      movie.description = movieData.opening_crawl;
      movie.releaseDate = movieData.release_date;
      movie.director = movieData.director;
      movie.producer = movieData.producer;

      movie.characters = await this.syncRelatedEntities(this.charactersRepository, movieData.characters);
      movie.planets = await this.syncRelatedEntities(this.planetsRepository, movieData.planets);
      movie.starships = await this.syncRelatedEntities(this.starshipsRepository, movieData.starships);
      movie.vehicles = await this.syncRelatedEntities(this.vehiclesRepository, movieData.vehicles);
      movie.species = await this.syncRelatedEntities(this.speciesRepository, movieData.species);

      try {
        const existingMovie = await this.moviesRepository.findOne({
          where: { id: movie.id },
          relations: ['characters', 'planets', 'starships', 'vehicles', 'species'],
        });

        if (existingMovie) {
          console.log(`Actualizando película: ${movie.title}`);
          await this.moviesRepository.save({ ...existingMovie, ...movie });
        } else {
          console.log(`Guardando nueva película: ${movie.title}`);
          await this.moviesRepository.save(movie);
        }
      } catch (dbError) {
        console.error(`Error guardando la película ${movie.title}:`, dbError.message);
      }
    }

    console.log('Películas sincronizadas correctamente.');
  } catch (error) {
    console.error('Error sincronizando películas:', error.message);
  }
}

  
  
}

