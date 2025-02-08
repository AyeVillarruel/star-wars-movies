import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @Inject(JwtService) private readonly jwtService: JwtService, 
    private configService: ConfigService,
  ) {    
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
        console.error(`Usuario no encontrado en la BD: ${email}`);
        return null;
    }

    // Si el usuario se registró con Google, no tiene contraseña
    if (!user.password) {
        return user; 
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
        console.error(`Contraseña incorrecta para el usuario: ${email}`);
        return null;
    }

    const { password, ...result } = user;
    return result;
  }


  async login(loginDto: LoginUserDto) {

    const { email, password } = loginDto;
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.password) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    try {
        const token = this.jwtService.sign(payload);
        return { access_token: token };
    } catch (error) {
        throw new Error('Error al firmar el token');
    }
  }



  async loginWithGoogle(email: string) {
    let user = await this.usersService.findByEmail(email);

    if (!user) {        
        try {
            user = await this.usersService.create({
                email,
                password: null, 
                role: UserRole.REGULAR, 
            });

        } catch (error) {
            throw new Error('Error al registrar usuario con Google');
        }
    } else {
        console.log(` Usuario encontrado en BD: ${JSON.stringify(user)}`);
    }

    const secretKey = this.configService.get<string>('JWT_SECRET');
    if (!secretKey) {
        throw new Error('JWT_SECRET is not defined');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    
    return { access_token: token };
}







}
