import { AxiosResponse, AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { AXIOS_INSTANCE_TOKEN } from '../axios-service';

// Mock configuration service
export const mockConfigService = {
  get: jest.fn((key: string) => {
    const config: Record<string, string | number> = {
      'eurocamp.baseUrl': 'http://localhost:3001',
      'eurocamp.timeout': 5000,
      'eurocamp.retryAttempts': 3,
      'eurocamp.retryDelay': 1000,
    };
    return config[key];
  }),
};

// Mock axios instance
export const createMockAxiosInstance = () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
});

// Test data builders
export const mockUserData = {
  single: { id: '1', name: 'John Doe', email: 'john@example.com' },
  list: [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  ],
};

export const mockParcData = {
  single: { id: '1', name: 'Test Parc', description: 'Test Description' },
  list: [
    { id: '1', name: 'Parc One', description: 'Description One' },
    { id: '2', name: 'Parc Two', description: 'Description Two' },
  ],
};

export const mockBookingData = {
  single: {
    id: '1',
    user: mockUserData.single,
    parc: mockParcData.single,
    bookingdate: '2026-01-10',
    comments: 'Test booking',
  },
  list: [
    {
      id: '1',
      user: mockUserData.single,
      parc: mockParcData.single,
      bookingdate: '2026-01-10',
      comments: 'Test booking 1',
    },
    {
      id: '2',
      user: mockUserData.list[1],
      parc: mockParcData.list[1],
      bookingdate: '2026-01-11',
      comments: 'Test booking 2',
    },
  ],
};

// Helper to create mock response
export const createMockResponse = <T>(data: T, status = 200): AxiosResponse => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {} as never,
});

// Helper to create axios error
export const createAxiosError = (statusCode: number = 500, message = 'Error') =>
  new AxiosError(message, String(statusCode), {} as never, {}, {
    status: statusCode,
    statusText: 'Error',
  } as AxiosResponse);

// Provider configurations for DI
export const getTestModuleProviders = (mockAxiosInstance: any) => [
  {
    provide: ConfigService,
    useValue: mockConfigService,
  },
  {
    provide: AXIOS_INSTANCE_TOKEN,
    useValue: mockAxiosInstance,
  },
];
