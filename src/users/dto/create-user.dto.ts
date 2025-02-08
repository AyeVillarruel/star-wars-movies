import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsIn, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export enum UserRole {
    REGULAR = 'REGULAR',
    ADMIN = 'ADMIN',
  }

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({description: 'user email', example: 'user@example.com'})
    email: string;
  
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/, {
        message:
          'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*)',
      })
      @ApiProperty({
        description: 'user password',
        minLength: 8,
        example: 'Contraseña123!'
      })
    password: string;


    @ApiProperty({
        example: UserRole.REGULAR,
        enum: UserRole, 
      })
      @IsEnum(UserRole)  
      role: UserRole;
  }