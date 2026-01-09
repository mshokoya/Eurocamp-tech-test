import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { EurocampClientService } from '../services/eurocamp-client-api/eurocamp-client.service';
import { UserDto, CreateUserDto, UserSwagger, CreateUserSwagger } from '../common/dto/api-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly eurocampClientService: EurocampClientService) { }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves all users from the Eurocamp API. This endpoint handles flakey API responses with automatic retry logic.'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all users',
    type: [UserSwagger]
  })
  @ApiResponse({
    status: 503,
    description: 'Service unavailable after retries'
  })
  async getAllUsers(): Promise<UserDto[]> {
    return this.eurocampClientService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves a specific user by their ID'
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user',
    type: UserSwagger
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  async getUserById(@Param('id') id: string): Promise<UserDto> {
    return this.eurocampClientService.getUserById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user. This endpoint has a high failure rate and uses retry logic to handle flakey responses.'
  })
  @ApiBody({
    type: CreateUserSwagger,
    description: 'User data to create'
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: UserSwagger
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user data'
  })
  @ApiResponse({
    status: 503,
    description: 'Service unavailable after retries'
  })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.eurocampClientService.createUser(createUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user by ID',
    description: 'Deletes a user by their ID'
  })
  @ApiParam({
    name: 'id',
    description: 'User ID to delete',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiResponse({
    status: 204,
    description: 'User successfully deleted'
  })
  @ApiResponse({
    status: 404,
    description: 'User not found'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.eurocampClientService.deleteUser(id);
  }
}