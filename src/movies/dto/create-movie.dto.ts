import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'A New Hope' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'It is a period of civil war...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'George Lucas' })
  @IsString()
  @IsNotEmpty()
  director: string;

  @ApiProperty({ example: 'Gary Kurtz, Rick McCallum' })
  @IsString()
  @IsNotEmpty()
  producer: string;

  @ApiProperty({ example: '1977-05-25' }) 
  @IsDateString() 
  @IsNotEmpty()
  releaseDate: string; 
}

