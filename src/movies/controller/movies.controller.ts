import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, ParseIntPipe, NotFoundException, Request } from '@nestjs/common';
import { MoviesService } from '../services/movies.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Movie } from '../entities/movies.entity';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { FavoriteMovieDto } from '../dto/favorite-movie.dto';
import { CustomRolesGuard } from '../../auth/guards/custom-roles.guard';
import { CustomJwtAuthGuard } from '../../auth/guards/custom-jwt.guard';

@ApiTags('movies')
@ApiBearerAuth()
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @UseGuards( JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'movies list' })
  @Roles('ADMIN', 'REGULAR')
  @ApiResponse({ status: 200, description: 'movies list' })
  @ApiResponse({ status: 401, description: 'You are not authorized. Please log in.' })

  findAll(): Promise<Movie[]> {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN', 'REGULAR')
  @ApiOperation({ summary: 'get a movie by id' })
  @ApiResponse({ status: 200, description: 'the movie has been successfully found.' })
  @ApiResponse({ status: 401, description: 'You are not authorized. Please log in.' })

  async findOne(@Param('id') id: number): Promise<Movie> {
    return this.moviesService.findById(id);
  }

@Get('user/favorites') 
@ApiOperation({ summary: 'Retrieve the authenticated user’s favorite movies' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('REGULAR', 'ADMIN')
@ApiResponse({ status: 401, description: 'You are not authorized. Please log in.' })
@ApiResponse({
  status: 200,
  description: 'List of user’s favorite movies',
  
})
async getUserFavorites(@Request() req) {
    return this.moviesService.getUserFavorites(req.user.id);
}

  @Post()
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'create a new movie- ONLY ADMIN' })
  @ApiResponse({ status: 201, description: 'the movie has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Access denied. You do not have the required role.' })
  @ApiResponse({ status: 401, description: 'You are not authorized. Please log in.' })
  create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesService.create(createMovieDto);
  }

  @Post('favorite')
  @ApiOperation({ summary: 'Add a movie to favorites' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('REGULAR', 'ADMIN')
  @ApiResponse({ status: 201, description: 'Movie successfully added to favorites' })
  @ApiResponse({ status: 400, description: 'Error adding movie to favorites' })
  @ApiBody({ type: FavoriteMovieDto, description: 'User and movie data to add' })
  @ApiResponse({ status: 401, description: 'You are not authorized. Please log in.' })
  async addFavorite(@Request() req, @Body() dto: Omit<FavoriteMovieDto, 'userId'>) {
    return this.moviesService.addFavorite({...dto, userId: req.user.id} );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a movie by ID - ONLY ADMIN' })
  @ApiResponse({ status: 200, description: 'The movie has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Access denied. You do not have the required role.' })
@ApiResponse({ status: 401, description: 'You are not authorized. Please log in.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN') 
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto
  ): Promise<Movie> {
    const updatedMovie = await this.moviesService.update(id, updateMovieDto);
    if (!updatedMovie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return updatedMovie;
  } 
  
@Delete(':id')
@ApiOperation({ summary: 'Delete a movie by ID - ONLY ADMIN' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN') 
@ApiResponse({ status: 200, description: 'The movie has been successfully deleted.' })
@ApiResponse({ status: 404, description: 'Movie not found' })
@ApiResponse({ status: 403, description: 'Access denied. You do not have the required role.' })
@ApiResponse({ status: 401, description: 'You are not authorized. Please log in.' })

async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
  const deleted = await this.moviesService.remove(id);
  if (!deleted) {
    throw new NotFoundException(`Movie with ID ${id} not found`);
  }
  return { message: `Movie with ID ${id} has been deleted` };
}

@Delete('favorite/:movieId')
@UseGuards(JwtAuthGuard, RolesGuard, CustomRolesGuard, CustomJwtAuthGuard)
@Roles('REGULAR', 'ADMIN')  
@ApiOperation({ summary: 'Remove a movie from favorites' })
@ApiResponse({ status: 200, description: 'Movie successfully removed from favorites' })
@ApiResponse({ status: 404, description: 'Movie not found in favorites' })
@ApiResponse({ status: 403, description: 'Access denied. You do not have the required role.' })
@ApiResponse({ status: 401, description: 'You are not authorized. Please log in.' })
async removeFavorite(@Request() req, @Param('movieId', ParseIntPipe) movieId: number) {
  return this.moviesService.removeFavorite({ userId: req.user.id, movieId });
}

  
}
