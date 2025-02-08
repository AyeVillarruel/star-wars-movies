import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserMovie } from './user_movies.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  @ApiProperty({ description: 'movie title', example: 'Star Wars' })
  title: string;

  @Column({ type: 'longtext',nullable: true })
  @ApiProperty({ description: 'movie description', example: 'A long description of the movie' })
  description: string;

  @Column({  nullable: true })
  @ApiProperty({ description: 'movie release date', example: '2022-01-01' })
  releaseDate: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'movie director', example: 'George Lucas' })
  director: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'movie producer', example: 'Star Wars' })
  producer: string;

  @OneToMany(() => UserMovie, (userMovie) => userMovie.movie)
  movieUsers: UserMovie[];
}
