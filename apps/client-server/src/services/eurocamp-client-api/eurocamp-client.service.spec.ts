import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse, AxiosError } from 'axios';
import { EurocampClientService } from './eurocamp-client.service';
import { ApiClientException, ApiRetryException } from '../../common/exceptions/api-exceptions';
import { AXIOS_INSTANCE_TOKEN } from '../axios-service';

describe('EurocampClientService', () => {
  let service: EurocampClientService;
  let mockAxiosInstance: {
    get: jest.Mock;
    post: jest.Mock;
    delete: jest.Mock;
  };

  const mockConfigService = {
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

  beforeEach(async () => {
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EurocampClientService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: AXIOS_INSTANCE_TOKEN,
          useValue: mockAxiosInstance,
        },
      ],
    }).compile();

    service = module.get<EurocampClientService>(EurocampClientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Users API', () => {
    describe('getAllUsers', () => {
      it('should return users when API call succeeds', async () => {
        const mockUsers = [
          { id: '1', name: 'John Doe', email: 'john@example.com' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        ];
        const mockResponse: AxiosResponse = {
          data: { data: mockUsers },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as never,
        };

        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await service.getAllUsers();

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users');
        expect(result).toEqual(mockUsers);
      });

      it('should retry and eventually succeed after failures', async () => {
        const mockUsers = [{ id: '1', name: 'John Doe', email: 'john@example.com' }];
        const mockResponse: AxiosResponse = {
          data: { data: mockUsers },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as never,
        };

        const error = new AxiosError('Server Error', '502', {} as never, {}, {
          status: 502,
          statusText: 'Bad Gateway',
        } as AxiosResponse);

        mockAxiosInstance.get
          .mockRejectedValueOnce(error)
          .mockResolvedValue(mockResponse);

        const result = await service.getAllUsers();

        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
        expect(result).toEqual(mockUsers);
      });

      it('should throw ApiRetryException after max retries exceeded', async () => {
        const error = new AxiosError('Server Error', '502', {} as never, {}, {
          status: 502,
          statusText: 'Bad Gateway',
        } as AxiosResponse);

        mockAxiosInstance.get.mockRejectedValue(error);

        await expect(service.getAllUsers()).rejects.toThrow(ApiRetryException);
        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
      });

      it('should not retry on 4xx errors', async () => {
        const error = new AxiosError('Bad Request', '400', {} as never, {}, {
          status: 400,
          statusText: 'Bad Request',
        } as AxiosResponse);

        mockAxiosInstance.get.mockRejectedValue(error);

        await expect(service.getAllUsers()).rejects.toThrow(ApiClientException);
        expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1); // No retries for 4xx
      });
    });

    describe('getUserById', () => {
      it('should return user when found', async () => {
        const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
        const mockResponse: AxiosResponse = {
          data: mockUser,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as never,
        };

        mockAxiosInstance.get.mockResolvedValue(mockResponse);

        const result = await service.getUserById('1');

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/1');
        expect(result).toEqual(mockUser);
      });

      it('should throw ApiClientException when user not found', async () => {
        const error = new AxiosError('Not Found', '404', {} as never, {}, {
          status: 404,
          statusText: 'Not Found',
        } as AxiosResponse);

        mockAxiosInstance.get.mockRejectedValue(error);

        await expect(service.getUserById('999')).rejects.toThrow(ApiClientException);
      });
    });

    describe('createUser', () => {
      it('should create user successfully', async () => {
        const newUser = { name: 'John Doe', email: 'john@example.com' };
        const createdUser = { id: '1', ...newUser };
        const mockResponse: AxiosResponse = {
          data: createdUser,
          status: 201,
          statusText: 'Created',
          headers: {},
          config: {} as never,
        };

        mockAxiosInstance.post.mockResolvedValue(mockResponse);

        const result = await service.createUser(newUser);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', newUser);
        expect(result).toEqual(createdUser);
      });

      it('should handle creation failures with retry', async () => {
        const newUser = { name: 'John Doe', email: 'john@example.com' };
        const createdUser = { id: '1', ...newUser };
        const mockResponse: AxiosResponse = {
          data: createdUser,
          status: 201,
          statusText: 'Created',
          headers: {},
          config: {} as never,
        };

        const error = new AxiosError('Server Error', '502', {} as never, {}, {
          status: 502,
          statusText: 'Bad Gateway',
        } as AxiosResponse);

        mockAxiosInstance.post
          .mockRejectedValueOnce(error)
          .mockResolvedValue(mockResponse);

        const result = await service.createUser(newUser);

        expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2);
        expect(result).toEqual(createdUser);
      });
    });

    describe('deleteUser', () => {
      it('should delete user successfully', async () => {
        const mockResponse: AxiosResponse = {
          data: null,
          status: 204,
          statusText: 'No Content',
          headers: {},
          config: {} as never,
        };

        mockAxiosInstance.delete.mockResolvedValue(mockResponse);

        await service.deleteUser('1');

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const error = new Error('Network Error');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(service.getAllUsers()).rejects.toThrow(ApiRetryException);
    });

    it('should handle timeout errors', async () => {
      const error = new AxiosError('Timeout', 'ECONNABORTED');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(service.getAllUsers()).rejects.toThrow(ApiRetryException);
    });
  });
});