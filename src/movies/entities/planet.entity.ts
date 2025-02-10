import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Movie } from './movies.entity';

@Entity()
export class Planet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @ManyToMany(() => Movie, (movie) => movie.planets)
  movies: Movie[];
}
