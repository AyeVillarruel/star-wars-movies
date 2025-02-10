import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { UserMovie } from './user_movies.entity';
import { Planet } from './planet.entity';
import { Characters } from './character.entity';
import { Starship } from './starship.entity';
import { Vehicle } from './vehicle.entity';
import { Species } from './Species.entity';

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

  @ManyToMany(() => Characters, (character) => character.movies, { cascade: true })
  @JoinTable()
  characters: Characters[];

  @ManyToMany(() => Planet, (planet) => planet.movies, { cascade: true })
  @JoinTable()
  planets: Planet[];

  @ManyToMany(() => Starship, (starship) => starship.movies, { cascade: true })
  @JoinTable()
  starships: Starship[];

  @ManyToMany(() => Vehicle, (vehicle) => vehicle.movies, { cascade: true })
  @JoinTable()
  vehicles: Vehicle[];

  @ManyToMany(() => Species, (species) => species.movies, { cascade: true })
  @JoinTable()
  species: Species[]

  @OneToMany(() => UserMovie, (userMovie) => userMovie.movie)
  movieUsers: UserMovie[];
}
