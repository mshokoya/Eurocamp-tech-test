import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EurocampClientService } from '../services/eurocamp-client-api/eurocamp-client.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly eurocampClientService: EurocampClientService) { }
}