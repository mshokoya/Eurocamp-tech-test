import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse, AxiosError } from 'axios';
import { EurocampClientService } from './eurocamp-client.service';
import { ApiClientException, ApiRetryException } from '../../common/exceptions/api-exceptions';
import {
  mockConfigService,
  createMockAxiosInstance,
  mockUserData,
  createMockResponse,
  createAxiosError,
  getTestModuleProviders,
} from './eurocamp-client.service.mocks';

describe('EurocampClientService - Users API', () => {
  let service: EurocampClientService;
  let mockAxiosInstance: any;

  beforeEach(async () => {
    mockAxiosInstance = createMockAxiosInstance();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EurocampClientService,
        ...getTestModuleProviders(mockAxiosInstance),
      ],
    }).compile();

    service = module.get<EurocampClientService>(EurocampClientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return users when API call succeeds', async () => {
      const mockResponse = createMockResponse({ data: mockUserData.list });
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getAllUsers();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockUserData.list);
    });

    it('should retry and eventually succeed after failures', async () => {
      const mockResponse = createMockResponse({ data: [mockUserData.single] });
      const error = createAxiosError(502, 'Bad Gateway');

      mockAxiosInstance.get
        .mockRejectedValueOnce(error)
        .mockResolvedValue(mockResponse);

      const result = await service.getAllUsers();

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
      expect(result).toEqual([mockUserData.single]);
    });

    it('should throw ApiRetryException after max retries exceeded', async () => {
      const error = createAxiosError(502, 'Bad Gateway');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(service.getAllUsers()).rejects.toThrow(ApiRetryException);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
    });

    it('should not retry on 4xx errors', async () => {
      const error = createAxiosError(400, 'Bad Request');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(service.getAllUsers()).rejects.toThrow(ApiClientException);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1); // No retries for 4xx
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockResponse = createMockResponse(mockUserData.single);
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getUserById('1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual(mockUserData.single);
    });

    it('should throw ApiClientException when user not found', async () => {
      const error = createAxiosError(404, 'Not Found');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(service.getUserById('999')).rejects.toThrow(ApiClientException);
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const newUser = { name: 'John Doe', email: 'john@example.com' };
      const mockResponse = createMockResponse(mockUserData.single, 201);

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await service.createUser(newUser);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', newUser);
      expect(result).toEqual(mockUserData.single);
    });

    it('should handle creation failures with retry', async () => {
      const newUser = { name: 'John Doe', email: 'john@example.com' };
      const mockResponse = createMockResponse(mockUserData.single, 201);
      const error = createAxiosError(502, 'Bad Gateway');

      mockAxiosInstance.post
        .mockRejectedValueOnce(error)
        .mockResolvedValue(mockResponse);

      const result = await service.createUser(newUser);

      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockUserData.single);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const mockResponse = createMockResponse(null, 204);
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      await service.deleteUser('1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1');
    });
  });
});
