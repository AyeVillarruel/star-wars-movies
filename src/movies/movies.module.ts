import { Module } from '@nestjs/common';
import { MoviesService } from './services/movies.service';
import { MoviesController } from './controller/movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movies.entity';
import { JwtService } from '@nestjs/jwt';
import { UserMovie } from './entities/user_movies.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, UserMovie, User]),
  UsersModule  ],
  providers: [MoviesService, JwtService],
  controllers: [MoviesController],
  exports: [MoviesService],
})
export class MoviesModule {}
