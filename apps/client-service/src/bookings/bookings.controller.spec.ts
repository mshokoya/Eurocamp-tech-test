import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { EurocampClientService } from '../services/eurocamp-client-api/eurocamp-client.service';
import { ApiClientException } from '../common/exceptions/api-exceptions';

describe('BookingsController', () => {
  let controller: BookingsController;
  let eurocampClientService: EurocampClientService;

  const mockEurocampClientService = {
    getAllBookings: jest.fn(),
    getBookingById: jest.fn(),
    createBooking: jest.fn(),
    deleteBooking: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: EurocampClientService,
          useValue: mockEurocampClientService,
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    eurocampClientService = module.get<EurocampClientService>(EurocampClientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBookings', () => {
    it('should return all bookings with retry handling', async () => {
      const mockBookings = [{
        id: '1',
        user: { id: '1', name: 'John Doe', email: 'john@example.com' },
        parc: { id: '1', name: 'Sunny Beach Resort', description: 'Beautiful resort' },
        bookingdate: '2024-07-15',
        comments: 'Special request for sea view',
      }];

      mockEurocampClientService.getAllBookings.mockResolvedValue(mockBookings);

      const result = await controller.getAllBookings();

      expect(eurocampClientService.getAllBookings).toHaveBeenCalled();
      expect(result).toEqual(mockBookings);
    });

    it('should handle flakey API errors', async () => {
      mockEurocampClientService.getAllBookings.mockRejectedValue(
        new ApiClientException('Service unavailable', 503)
      );

      await expect(controller.getAllBookings()).rejects.toThrow(ApiClientException);
    });
  });

  describe('getBookingById', () => {
    it('should return booking by id', async () => {
      const mockBooking = {
        id: '1',
        user: { id: '1', name: 'John Doe', email: 'john@example.com' },
        parc: { id: '1', name: 'Sunny Beach Resort', description: 'Beautiful resort' },
        bookingdate: '2024-07-15',
        comments: 'Special request for sea view',
      };

      mockEurocampClientService.getBookingById.mockResolvedValue(mockBooking);

      const result = await controller.getBookingById('1');

      expect(eurocampClientService.getBookingById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockBooking);
    });
  });

  describe('createBooking', () => {
    it('should create a new booking', async () => {
      const createBookingDto = {
        user: '1',
        parc: '1',
        bookingdate: '2024-07-15',
        comments: 'Special request',
      };
      const createdBooking = {
        id: '1',
        user: { id: '1', name: 'John Doe', email: 'john@example.com' },
        parc: { id: '1', name: 'Sunny Beach Resort', description: 'Beautiful resort' },
        bookingdate: createBookingDto.bookingdate,
        comments: createBookingDto.comments,
      };

      mockEurocampClientService.createBooking.mockResolvedValue(createdBooking);

      const result = await controller.createBooking(createBookingDto);

      expect(eurocampClientService.createBooking).toHaveBeenCalledWith(createBookingDto);
      expect(result).toEqual(createdBooking);
    });
  });

  describe('deleteBooking', () => {
    it('should delete booking successfully', async () => {
      mockEurocampClientService.deleteBooking.mockResolvedValue(undefined);

      await controller.deleteBooking('1');

      expect(eurocampClientService.deleteBooking).toHaveBeenCalledWith('1');
    });
  });
});