import { UserDto, CreateUserDto, ParcDto, CreateParcDto, BookingDto, CreateBookingDto } from '../dto/api-response.dto';

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

  // Parcs
  getAllParcs(): Promise<ParcDto[]>;
  getParcById(id: string): Promise<ParcDto>;
  createParc(parcData: CreateParcDto): Promise<ParcDto>;
  deleteParc(id: string): Promise<void>;

  // Bookings
  getAllBookings(): Promise<BookingDto[]>;
  getBookingById(id: string): Promise<BookingDto>;
  createBooking(bookingData: CreateBookingDto): Promise<BookingDto>;
  deleteBooking(id: string): Promise<void>;
}