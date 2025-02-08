import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class FavoriteMovieDto {
  @ApiProperty({ description: 'Movie ID', example: 101 })
  @IsInt()
  movieId: number;

  userId: number; 
}

