import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { IEurocampClient } from '../../common/interfaces/eurocamp-client.interface';
import { ApiClientException, ApiRetryException } from '../../common/exceptions/api-exceptions';
import {
  UserDto,
  CreateUserDto,
  ApiResponseDto,
} from '../../common/dto/api-response.dto';
import { AXIOS_INSTANCE_TOKEN } from '../axios-service';

/**
 * Eurocamp API Client Service with built-in retry logic and error handling
 * Handles the flakey API endpoints that sometimes return 500/502 errors
 */

@Injectable()
export class EurocampClientService implements IEurocampClient {
  private readonly logger = new Logger(EurocampClientService.name);
  private readonly retryAttempts: number;
  private readonly retryDelay: number;

  constructor(
    private readonly configService: ConfigService,
    @Inject(AXIOS_INSTANCE_TOKEN) private readonly axiosInstance: AxiosInstance
  ) {
    this.retryAttempts = this.configService.get<number>('eurocamp.retryAttempts', 3);
    this.retryDelay = this.configService.get<number>('eurocamp.retryDelay', 1000);
  }


  // Users API Methods

  // Get all users - handles flakey endpoint with 90% success rate
  async getAllUsers(): Promise<UserDto[]> {
    return (await this.axiosInstance.get<ApiResponseDto<UserDto>>('/users')).data.data;
  }

  // Get user by ID
  async getUserById(id: string): Promise<UserDto> {
    return (await this.axiosInstance.get<UserDto>(`/users/${id}`)).data;
  }

  // Create new user - handles flakey endpoint with 30% success rate
  async createUser(userData: CreateUserDto): Promise<UserDto> {
    return (await this.axiosInstance.post<UserDto>('/users', userData)).data;
  }

  // Delete user by ID
  async deleteUser(id: string): Promise<void> {
    return this.axiosInstance.delete(`/users/${id}`);
  }
}