import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SyncMoviesCron } from './sync-movies.cron';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [HttpModule, MoviesModule],
  providers: [SyncMoviesCron],
  exports: [SyncMoviesCron],
})
export class CronModule {}
