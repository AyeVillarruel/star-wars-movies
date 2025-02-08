import { Injectable, OnModuleInit } from '@nestjs/common';
import { MoviesService } from '../movies/services/movies.service';
import axios from 'axios';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SyncMoviesCron implements OnModuleInit {
  constructor(private moviesService: MoviesService) {}

  // Se ejecuta al iniciar la aplicación
  async onModuleInit() {
    console.log('Sincronizando peliculas al iniciar la aplicacion...');
    await this.syncMovies();
  }

  @Cron('0 0 * * *') 
  async syncMovies() {
    console.log('Sincronizando pelculas desde la API de Star Wars...');

    try {
      const response = await axios.get('https://swapi.dev/api/films/');
      const movies = response.data.results.map(movie => ({
        title: movie.title,
        description: movie.opening_crawl,
        releaseDate: movie.release_date,
        director: movie.director,
      }));

      for (const movie of movies) {
        try {
          const savedMovie = await this.moviesService.create(movie);
          console.log(`Pelcula guardada en DB: ${savedMovie.title}`);
        } catch (dbError) {
          console.error(`error guardando la pelcula ${movie.title}:`, dbError.message);
        }
      }

      console.log('Peliculas sincronizadas correctamente.');
    } catch (error) {
      console.error('error sincronizando pelculas:', error.message);
    }
  }
}
