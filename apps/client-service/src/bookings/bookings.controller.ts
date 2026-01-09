import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { EurocampClientService } from '../services/eurocamp-client-api/eurocamp-client.service';
import { BookingDto, CreateBookingDto, BookingSwagger, CreateBookingSwagger } from '../common/dto/api-response.dto';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly eurocampClientService: EurocampClientService) { }

  @Get()
  @ApiOperation({
    summary: 'Get all bookings',
    description: 'Retrieves all bookings from the Eurocamp API. This endpoint has a 90% success rate and uses retry logic.'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all bookings',
    type: [BookingSwagger]
  })
  @ApiResponse({
    status: 503,
    description: 'Service unavailable after retries'
  })
  async getAllBookings(): Promise<BookingDto[]> {
    return this.eurocampClientService.getAllBookings();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get booking by ID',
    description: 'Retrieves a specific booking by ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Booking ID',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved booking',
    type: BookingSwagger
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found'
  })
  async getBookingById(@Param('id') id: string): Promise<BookingDto> {
    return this.eurocampClientService.getBookingById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new booking',
    description: 'Creates a new booking with the provided data'
  })
  @ApiBody({
    type: CreateBookingSwagger,
    description: 'Booking data to create'
  })
  @ApiResponse({
    status: 201,
    description: 'Booking successfully created',
    type: BookingSwagger
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid booking data'
  })
  @HttpCode(HttpStatus.CREATED)
  async createBooking(@Body() createBookingDto: CreateBookingDto): Promise<BookingDto> {
    return this.eurocampClientService.createBooking(createBookingDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete booking by ID',
    description: 'Deletes a booking by ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Booking ID to delete',
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @ApiResponse({
    status: 204,
    description: 'Booking successfully deleted'
  })
  @ApiResponse({
    status: 404,
    description: 'Booking not found'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBooking(@Param('id') id: string): Promise<void> {
    return this.eurocampClientService.deleteBooking(id);
  }
}