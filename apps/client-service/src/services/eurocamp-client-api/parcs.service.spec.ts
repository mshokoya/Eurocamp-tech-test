import { Test, TestingModule } from '@nestjs/testing';
import { EurocampClientService } from './eurocamp-client.service';
import { ApiClientException } from '../../common/exceptions/api-exceptions';
import {
  createMockAxiosInstance,
  mockParcData,
  createMockResponse,
  createAxiosError,
  getTestModuleProviders,
} from './eurocamp-client.service.mocks';

describe('EurocampClientService - Parcs API', () => {
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

  describe('getAllParcs', () => {
    it('should return parcs when API call succeeds', async () => {
      const mockResponse = createMockResponse({ data: mockParcData.list });
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getAllParcs();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/parcs');
      expect(result).toEqual(mockParcData.list);
    });

    it('should retry and eventually succeed after failures', async () => {
      const mockResponse = createMockResponse({ data: [mockParcData.single] });
      const error = createAxiosError(504, 'Gateway Timeout');

      mockAxiosInstance.get
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValue(mockResponse);

      const result = await service.getAllParcs();

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(3);
      expect(result).toEqual([mockParcData.single]);
    });
  });

  describe('getParcById', () => {
    it('should return parc when found', async () => {
      const mockResponse = createMockResponse(mockParcData.single);
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getParcById('1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/parcs/1');
      expect(result).toEqual(mockParcData.single);
    });

    it('should handle flakey endpoint with retries', async () => {
      const mockResponse = createMockResponse(mockParcData.single);
      const error = createAxiosError(502, 'Bad Gateway');

      mockAxiosInstance.get
        .mockRejectedValueOnce(error)
        .mockResolvedValue(mockResponse);

      const result = await service.getParcById('1');

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockParcData.single);
    });

    it('should throw ApiClientException when parc not found', async () => {
      const error = createAxiosError(404, 'Not Found');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(service.getParcById('999')).rejects.toThrow(ApiClientException);
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('createParc', () => {
    it('should create parc successfully', async () => {
      const newParc = { name: 'New Resort', description: 'Amazing new location' };
      const mockResponse = createMockResponse(mockParcData.single, 201);

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await service.createParc(newParc);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/parcs', newParc);
      expect(result).toEqual(mockParcData.single);
    });

    it('should retry on server errors', async () => {
      const newParc = { name: 'New Resort', description: 'Amazing new location' };
      const mockResponse = createMockResponse(mockParcData.single, 201);
      const error = createAxiosError(500, 'Internal Server Error');

      mockAxiosInstance.post
        .mockRejectedValueOnce(error)
        .mockResolvedValue(mockResponse);

      const result = await service.createParc(newParc);

      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockParcData.single);
    });
  });

  describe('deleteParc', () => {
    it('should delete parc successfully', async () => {
      const mockResponse = createMockResponse(null, 204);
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      await service.deleteParc('1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/parcs/1');
    });
  });
});
