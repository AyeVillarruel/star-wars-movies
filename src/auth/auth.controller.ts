import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService} from './services/auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LoginUserDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiOAuth2, ApiBody } from '@nestjs/swagger';
import { LoginResponse } from './interfaces/login-response.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Successfully logged in' })
  async login(@Body() loginDto: LoginUserDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);

  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOAuth2([])
  @ApiOperation({ summary: 'Redirigir a Google para autenticación', description: 'Este endpoint solo es accesible desde un navegador.' })
  async googleAuth() { return { message: 'Redirecting to Google OAuth...' };}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Handle Google OAuth2 callback' })
  @ApiResponse({ status: 200, description: 'User successfully authenticated via Google' })
  @ApiResponse({ status: 401, description: 'Google authentication failed' })
   async googleAuthRedirect(@Req() req) {

        if (!req.user || !req.user.email) {
            throw new Error('Google authentication failed: No email received');
        }

        const token = await this.authService.loginWithGoogle(req.user.email);
    
        return {
            message: 'Authentication successful',
            access_token: token.access_token
        };
    }

}
