import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
    @ApiProperty({ description: 'User email', example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty({
      description: 'User password',
      example: 'Contraseña123!',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
  }