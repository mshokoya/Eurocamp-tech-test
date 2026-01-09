import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EurocampClientService } from '../services/eurocamp-client-api/eurocamp-client.service';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly eurocampClientService: EurocampClientService) { }

}