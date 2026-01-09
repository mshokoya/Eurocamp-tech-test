import { UserDto, CreateUserDto } from '../dto/api-response.dto';

export interface EurocampClientConfig {
  baseUrl: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface IEurocampClient {
  // Users
  getAllUsers(): Promise<UserDto[]>;
  getUserById(id: string): Promise<UserDto>;
  createUser(userData: CreateUserDto): Promise<UserDto>;
  deleteUser(id: string): Promise<void>;

}