import { ApiProperty } from '@nestjs/swagger';

export interface ApiResponseDto<T> {
  data: T[];
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

// Swagger documentation classes
export class ApiResponseSwagger<T> {
  @ApiProperty({ description: 'Array of data items' })
  data!: T[];
}

export class UserSwagger {
  @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name!: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  email!: string;
}

export class CreateUserSwagger {
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name!: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  email!: string;
}