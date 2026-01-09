import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ParcDto, CreateParcDto, ParcSwagger, CreateParcSwagger } from '../common/dto/api-response.dto';
import { EurocampClientService } from '../services/eurocamp-client-api/eurocamp-client.service';

@ApiTags('parcs')
@Controller('parcs')
export class ParcsController {
  constructor(private readonly eurocampClientService: EurocampClientService) { }

  @Get()
  @ApiOperation({
    summary: 'Get all parcs',
    description: 'Retrieves all parcs from the Eurocamp API'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all parcs',
    type: [ParcSwagger]
  })
  async getAllParcs(): Promise<ParcDto[]> {
    return this.eurocampClientService.getAllParcs();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get parc by ID',
    description: 'Retrieves a specific parc by ID. This endpoint has a 70% success rate and uses retry logic.'
  })
  @ApiParam({
    name: 'id',
    description: 'Parc ID',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved parc',
    type: ParcSwagger
  })
  @ApiResponse({
    status: 404,
    description: 'Parc not found'
  })
  @ApiResponse({
    status: 503,
    description: 'Service unavailable after retries'
  })
  async getParcById(@Param('id') id: string): Promise<ParcDto> {
    return this.eurocampClientService.getParcById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new parc',
    description: 'Creates a new parc with the provided data'
  })
  @ApiBody({
    type: CreateParcSwagger,
    description: 'Parc data to create'
  })
  @ApiResponse({
    status: 201,
    description: 'Parc successfully created',
    type: ParcSwagger
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parc data'
  })
  @HttpCode(HttpStatus.CREATED)
  async createParc(@Body() createParcDto: CreateParcDto): Promise<ParcDto> {
    return this.eurocampClientService.createParc(createParcDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete parc by ID',
    description: 'Deletes a parc by their ID'
  })
  @ApiParam({
    name: 'id',
    description: 'Parc ID to delete',
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @ApiResponse({
    status: 204,
    description: 'Parc successfully deleted'
  })
  @ApiResponse({
    status: 404,
    description: 'Parc not found'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteParc(@Param('id') id: string): Promise<void> {
    return this.eurocampClientService.deleteParc(id);
  }
}