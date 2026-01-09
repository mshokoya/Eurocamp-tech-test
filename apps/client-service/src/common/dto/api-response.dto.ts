import { ApiProperty } from '@nestjs/swagger';

export interface ApiResponseDto<T> {
  data: T[];
}

// ------------

export interface UserDto {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

// ------------

export interface ParcDto {
  id: string;
  name: string;
  description: string;
}

export interface CreateParcDto {
  name: string;
  description: string;
}

// ------------

export interface BookingDto {
  id: string;
  user: UserDto;
  parc: ParcDto;
  bookingdate: string;
  comments: string;
}

export interface CreateBookingDto {
  user: string;
  parc: string;
  bookingdate: string;
  comments: string;
}

// ------------

// Swagger documentation classes
export class ApiResponseSwagger<T> {
  @ApiProperty({ description: 'Array of data items' })
  data!: T[];
}

// ------------

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

// ------------

export class ParcSwagger {
  @ApiProperty({ description: 'Parc ID', example: '123e4567-e89b-12d3-a456-426614174001' })
  id!: string;

  @ApiProperty({ description: 'Parc name', example: 'Sunny Beach Resort' })
  name!: string;

  @ApiProperty({ description: 'Parc description', example: 'Beautiful beachfront resort with amazing facilities' })
  description!: string;
}

export class CreateParcSwagger {
  @ApiProperty({ description: 'Parc name', example: 'Sunny Beach Resort' })
  name!: string;

  @ApiProperty({ description: 'Parc description', example: 'Beautiful beachfront resort' })
  description!: string;
}

// ------------

export class BookingSwagger {
  @ApiProperty({ description: 'Booking ID', example: '123e4567-e89b-12d3-a456-426614174002' })
  id!: string;

  @ApiProperty({ description: 'User who made the booking', type: UserSwagger })
  user!: UserSwagger;

  @ApiProperty({ description: 'Parc being booked', type: ParcSwagger })
  parc!: ParcSwagger;

  @ApiProperty({ description: 'Booking date', example: '2024-07-15' })
  bookingdate!: string;

  @ApiProperty({ description: 'Booking comments', example: 'Special request for sea view' })
  comments!: string;
}

export class CreateBookingSwagger {
  @ApiProperty({ description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  user!: string;

  @ApiProperty({ description: 'Parc ID', example: '123e4567-e89b-12d3-a456-426614174001' })
  parc!: string;

  @ApiProperty({ description: 'Booking date', example: '2024-07-15' })
  bookingdate!: string;

  @ApiProperty({ description: 'Booking comments', example: 'Special request for sea view' })
  comments!: string;
}