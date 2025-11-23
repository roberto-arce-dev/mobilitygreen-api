import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../enums/roles.enum';

/**
 * DTO para registro de usuarios
 * Crea User + Profile correspondiente según el rol
 */
export class RegisterDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email del usuario',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: Role.USUARIO,
    description: 'Rol del usuario',
    enum: [Role.USUARIO],
  })
  @IsNotEmpty()
  @IsEnum([Role.USUARIO])
  role: Role;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiPropertyOptional({
    example: '+51 987654321',
    description: 'Teléfono de contacto',
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'licenciaConducir (opcional)',
  })
  @IsOptional()
  @IsString()
  licenciaConducir?: string;

  @ApiPropertyOptional({
    example: 'Valor de ejemplo',
    description: 'metodoPago (opcional)',
  })
  @IsOptional()
  @IsString()
  metodoPago?: string;

}
