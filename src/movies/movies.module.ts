import { Module } from '@nestjs/common';
import { MoviesService } from './services/movies.service';
import { MoviesController } from './controller/movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movies.entity';
import { JwtService } from '@nestjs/jwt';
import { UserMovie } from './entities/user_movies.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/users.entity';
import { Character } from './entities/character.entity';
import { Planet } from './entities/planet.entity';
import { Starship } from './entities/starship.entity';
import { Vehicle } from './entities/vehicle.entity';
import { Species } from './entities/Species.entity';
import { SyncMoviesCron } from 'src/cron/sync-movies.cron';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, UserMovie, User, Character, Planet, Starship, Vehicle, Species]),
  UsersModule  ],
  providers: [MoviesService, JwtService, SyncMoviesCron],
  controllers: [MoviesController],
  exports: [TypeOrmModule, MoviesService],
})
export class MoviesModule {}
