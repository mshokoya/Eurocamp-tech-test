import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { IEurocampClient } from '../../common/interfaces/eurocamp-client.interface';
import { ApiClientException, ApiRetryException } from '../../common/exceptions/api-exceptions';
import {
  UserDto,
  CreateUserDto,
  ApiResponseDto,
  ParcDto,
  CreateParcDto,
  BookingDto,
  CreateBookingDto
} from '../../common/dto/api-response.dto';
import { AXIOS_INSTANCE_TOKEN } from '../axios-service';


// Eurocamp API Client Service with built-in retry logic and error handling

@Injectable()
export class EurocampClientService implements IEurocampClient {
  private readonly logger = new Logger(EurocampClientService.name);
  private readonly retryAttempts: number;
  private readonly retryDelay: number;

  constructor(
    private readonly configService: ConfigService,
    @Inject(AXIOS_INSTANCE_TOKEN) private readonly axiosInstance: AxiosInstance
  ) {
    this.retryAttempts = this.configService.get<number>('eurocamp.retryAttempts');
    this.retryDelay = this.configService.get<number>('eurocamp.retryDelay');
  }


  // Execute API call with retry logic for handling flakey endpoints
  private async executeWithRetry<T>(
    operation: () => Promise<AxiosResponse<T>>,
    attempt = 1
  ): Promise<T> {
    try {
      const response = await operation();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      // Don't retry on 4xx errors (client errors)
      if (axiosError.response?.status && axiosError.response.status < 500) {
        throw new ApiClientException(
          `API Error: ${axiosError.message}`,
          axiosError.response.status,
          axiosError
        );
      }

      // Retry on 5xx errors or network errors
      if (attempt <= this.retryAttempts) {
        this.logger.warn(`Attempt ${attempt} failed, retrying in ${this.retryDelay}ms...`);
        await this.delay(this.retryDelay);
        return this.executeWithRetry(operation, attempt + 1);
      }

      // Max retries exceeded
      throw new ApiRetryException(
        `API call failed after ${this.retryAttempts} retries: ${axiosError.message}`,
        this.retryAttempts,
        axiosError
      );
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ---------

  // Users API Methods

  // Get all users - handles flakey endpoint with 90% success rate
  async getAllUsers(): Promise<UserDto[]> {
    const response = await this.executeWithRetry(async () => {
      return this.axiosInstance.get<ApiResponseDto<UserDto>>('/users');
    });
    return (response as ApiResponseDto<UserDto>).data;
  }

  // Get user by ID
  async getUserById(id: string): Promise<UserDto> {
    return this.executeWithRetry(async () => {
      return this.axiosInstance.get<UserDto>(`/users/${id}`);
    });
  }

  // Create new user - handles flakey endpoint with 30% success rate
  async createUser(userData: CreateUserDto): Promise<UserDto> {
    return this.executeWithRetry(async () => {
      return this.axiosInstance.post<UserDto>('/users', userData);
    });
  }

  // Delete user by ID
  async deleteUser(id: string): Promise<void> {
    await this.executeWithRetry(async () => {
      return this.axiosInstance.delete(`/users/${id}`);
    });
  }

  // ------------

  // Parcs API Methods

  // Get all parcs
  async getAllParcs(): Promise<ParcDto[]> {
    const response = await this.executeWithRetry(async () => {
      return this.axiosInstance.get<ApiResponseDto<ParcDto>>('/parcs');
    });
    return (response as ApiResponseDto<ParcDto>).data;
  }


  // Get parc by ID - handles flakey endpoint with 70% success rate
  async getParcById(id: string): Promise<ParcDto> {
    return this.executeWithRetry(async () => {
      return this.axiosInstance.get<ParcDto>(`/parcs/${id}`);
    });
  }


  // Create new parc
  async createParc(parcData: CreateParcDto): Promise<ParcDto> {
    return this.executeWithRetry(async () => {
      return this.axiosInstance.post<ParcDto>('/parcs', parcData);
    });
  }

  // Delete parc by ID
  async deleteParc(id: string): Promise<void> {
    await this.executeWithRetry(async () => {
      return this.axiosInstance.delete(`/parcs/${id}`);
    });
  }

  // Bookings API Methods


  // Get all bookings - handles flakey endpoint with 90% success rate
  async getAllBookings(): Promise<BookingDto[]> {
    const response = await this.executeWithRetry(async () => {
      return this.axiosInstance.get<ApiResponseDto<BookingDto>>('/bookings');
    });
    return (response as ApiResponseDto<BookingDto>).data;
  }


  // Get booking by ID
  async getBookingById(id: string): Promise<BookingDto> {
    return this.executeWithRetry(async () => {
      return this.axiosInstance.get<BookingDto>(`/bookings/${id}`);
    });
  }

  // Create new booking
  async createBooking(bookingData: CreateBookingDto): Promise<BookingDto> {
    return this.executeWithRetry(async () => {
      return this.axiosInstance.post<BookingDto>('/bookings', bookingData);
    });
  }

  // Delete booking by ID
  async deleteBooking(id: string): Promise<void> {
    await this.executeWithRetry(async () => {
      return this.axiosInstance.delete(`/bookings/${id}`);
    });
  }
}