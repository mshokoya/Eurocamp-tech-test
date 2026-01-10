import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse, AxiosError } from 'axios';
import { EurocampClientService } from './eurocamp-client.service';
import { ApiClientException, ApiRetryException } from '../../common/exceptions/api-exceptions';
import {
  mockConfigService,
  createMockAxiosInstance,
  mockBookingData,
  mockUserData,
  mockParcData,
  createMockResponse,
  createAxiosError,
  getTestModuleProviders,
} from './eurocamp-client.service.mocks';

describe('EurocampClientService - Bookings API', () => {
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

  describe('getAllBookings', () => {
    it('should return bookings when API call succeeds', async () => {
      const mockResponse = createMockResponse({ data: mockBookingData.list });
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getAllBookings();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/bookings');
      expect(result).toEqual(mockBookingData.list);
    });

    it('should handle flakey endpoint with retries (90% success rate)', async () => {
      const mockResponse = createMockResponse({ data: [mockBookingData.single] });
      const error = createAxiosError(503, 'Service Unavailable');

      mockAxiosInstance.get
        .mockRejectedValueOnce(error)
        .mockResolvedValue(mockResponse);

      const result = await service.getAllBookings();

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
      expect(result).toEqual([mockBookingData.single]);
    });
  });

  describe('getBookingById', () => {
    it('should return booking when found', async () => {
      const mockResponse = createMockResponse(mockBookingData.single);
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await service.getBookingById('1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/bookings/1');
      expect(result).toEqual(mockBookingData.single);
    });

    it('should throw ApiClientException when booking not found', async () => {
      const error = createAxiosError(404, 'Not Found');
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(service.getBookingById('999')).rejects.toThrow(ApiClientException);
    });
  });

  describe('createBooking', () => {
    it('should create booking successfully', async () => {
      const newBooking = {
        user: 'user1',
        parc: 'parc1',
        bookingdate: '2026-01-10',
        comments: 'Special request for sea view',
      };
      const mockResponse = createMockResponse(mockBookingData.single, 201);

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await service.createBooking(newBooking);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/bookings', newBooking);
      expect(result).toEqual(mockBookingData.single);
    });

    it('should retry on server errors', async () => {
      const newBooking = {
        user: 'user1',
        parc: 'parc1',
        bookingdate: '2026-01-10',
        comments: 'Special request',
      };
      const mockResponse = createMockResponse(mockBookingData.single, 201);
      const error = createAxiosError(502, 'Bad Gateway');

      mockAxiosInstance.post
        .mockRejectedValueOnce(error)
        .mockResolvedValue(mockResponse);

      const result = await service.createBooking(newBooking);

      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockBookingData.single);
    });

    it('should not retry on conflict errors (409)', async () => {
      const newBooking = {
        user: 'user1',
        parc: 'parc1',
        bookingdate: '2026-01-10',
        comments: 'Special request',
      };
      const error = createAxiosError(409, 'Conflict');

      mockAxiosInstance.post.mockRejectedValue(error);

      await expect(service.createBooking(newBooking)).rejects.toThrow(ApiClientException);
      expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteBooking', () => {
    it('should delete booking successfully', async () => {
      const mockResponse = createMockResponse(null, 204);
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      await service.deleteBooking('1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/bookings/1');
    });

    it('should retry on server errors', async () => {
      const mockResponse = createMockResponse(null, 204);
      const error = createAxiosError(504, 'Gateway Timeout');

      mockAxiosInstance.delete
        .mockRejectedValueOnce(error)
        .mockResolvedValue(mockResponse);

      await service.deleteBooking('1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledTimes(2);
    });
  });
});
