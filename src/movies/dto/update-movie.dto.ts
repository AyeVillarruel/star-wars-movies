import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @ApiProperty({ example: 'New Title', description: 'Title of the movie', required: false })
  title?: string;

  @ApiProperty({ example: 'New Description', description: 'Description of the movie', required: false })
  description?: string;

  @ApiProperty({ example: 'New Director', description: 'Director of the movie', required: false })
  director?: string;

  @ApiProperty({ example: 'New Producer', description: 'Producer of the movie', required: false })
  producer?: string;

  @ApiProperty({ example: '2025-12-15', description: 'Release date of the movie', required: false })
  releaseDate?: string;
}
