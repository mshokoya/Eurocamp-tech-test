import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse, AxiosError } from 'axios';
import { EurocampClientService } from './eurocamp-client.service';
import { ApiClientException, ApiRetryException } from '../../common/exceptions/api-exceptions';
import { createMockAxiosInstance, getTestModuleProviders } from './eurocamp-client.service.mocks';

describe('EurocampClientService', () => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Error Handling & Retry Logic', () => {
    it('should handle network errors with retries', async () => {
      const error = new Error('Network Error');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(service.getAllUsers()).rejects.toThrow(ApiRetryException);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
    }, 10000);

    it('should handle timeout errors with retries', async () => {
      const error = new AxiosError('Timeout', 'ECONNABORTED');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(service.getAllUsers()).rejects.toThrow(ApiRetryException);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(4);
    }, 10000);

    it('should handle connection refused errors with retries', async () => {
      const error = new AxiosError('Connection refused', 'ECONNREFUSED');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(service.getAllUsers()).rejects.toThrow(ApiRetryException);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(4);
    }, 10000);

    it('should not retry on 401 Unauthorized', async () => {
      const error = new AxiosError('Unauthorized', '401', {} as never, {}, {
        status: 401,
        statusText: 'Unauthorized',
      } as AxiosResponse);

      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(service.getAllUsers()).rejects.toThrow(ApiClientException);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
    });

    it('should not retry on 403 Forbidden', async () => {
      const error = new AxiosError('Forbidden', '403', {} as never, {}, {
        status: 403,
        statusText: 'Forbidden',
      } as AxiosResponse);

      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(service.createUser({ name: 'Test', email: 'test@test.com' })).rejects.toThrow(ApiClientException);
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
    });

    it('should retry exactly the configured number of times', async () => {
      const error = new AxiosError('Server Error', '500', {} as never, {}, {
        status: 500,
        statusText: 'Internal Server Error',
      } as AxiosResponse);

      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(service.getAllUsers()).rejects.toThrow(ApiRetryException);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(4); // 1 initial + 3 retries (from config)
    }, 10000);

    it('should include original error in ApiRetryException', async () => {
      const originalError = new AxiosError('Server Error', '500', {} as never, {}, {
        status: 500,
        statusText: 'Internal Server Error',
      } as AxiosResponse);

      mockAxiosInstance.get.mockRejectedValue(originalError);

      try {
        await service.getAllUsers();
        fail('Expected ApiRetryException to be thrown');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ApiRetryException);
        expect((error as ApiRetryException).message).toContain('API call failed after 3 retries');
      }
    }, 10000); // 10 second timeout

    it('should include original error in ApiClientException', async () => {
      const originalError = new AxiosError('Bad Request', '400', {} as never, {}, {
        status: 400,
        statusText: 'Bad Request',
      } as AxiosResponse);

      mockAxiosInstance.get.mockRejectedValue(originalError);

      try {
        await service.getAllUsers();
        fail('Expected ApiClientException to be thrown');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(ApiClientException);
        expect((error as ApiClientException).message).toContain('API Error');
      }
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