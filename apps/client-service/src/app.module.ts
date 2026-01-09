import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config';
import AxiosService from './services/axios-service';
import { EurocampClientService } from './services/eurocamp-client-api/eurocamp-client.service';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
  ],
  controllers: [UsersController],
  providers: [AxiosService, EurocampClientService],
})
export class AppModule { }
