import { Test, TestingModule } from '@nestjs/testing';
import { ParcsController } from './parcs.controller';
import { ApiClientException } from '../common/exceptions/api-exceptions';
import { EurocampClientService } from '../services/eurocamp-client-api/eurocamp-client.service';

describe('ParcsController', () => {
  let controller: ParcsController;
  let eurocampClientService: EurocampClientService;

  const mockEurocampClientService = {
    getAllParcs: jest.fn(),
    getParcById: jest.fn(),
    createParc: jest.fn(),
    deleteParc: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParcsController],
      providers: [
        {
          provide: EurocampClientService,
          useValue: mockEurocampClientService,
        },
      ],
    }).compile();

    controller = module.get<ParcsController>(ParcsController);
    eurocampClientService = module.get<EurocampClientService>(EurocampClientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllParcs', () => {
    it('should return all parcs', async () => {
      const mockParcs = [
        { id: '1', name: 'Sunny Beach Resort', description: 'Beautiful beachfront resort' },
        { id: '2', name: 'Mountain View Lodge', description: 'Scenic mountain retreat' },
      ];

      mockEurocampClientService.getAllParcs.mockResolvedValue(mockParcs);

      const result = await controller.getAllParcs();

      expect(eurocampClientService.getAllParcs).toHaveBeenCalled();
      expect(result).toEqual(mockParcs);
    });
  });

  describe('getParcById', () => {
    it('should return parc by id with retry handling', async () => {
      const mockParc = { id: '1', name: 'Sunny Beach Resort', description: 'Beautiful beachfront resort' };

      mockEurocampClientService.getParcById.mockResolvedValue(mockParc);

      const result = await controller.getParcById('1');

      expect(eurocampClientService.getParcById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockParc);
    });

    it('should handle flakey API errors', async () => {
      mockEurocampClientService.getParcById.mockRejectedValue(
        new ApiClientException('Service unavailable', 503)
      );

      await expect(controller.getParcById('1')).rejects.toThrow(ApiClientException);
    });
  });

  describe('createParc', () => {
    it('should create a new parc', async () => {
      const createParcDto = { name: 'New Resort', description: 'Amazing new location' };
      const createdParc = { id: '1', ...createParcDto };

      mockEurocampClientService.createParc.mockResolvedValue(createdParc);

      const result = await controller.createParc(createParcDto);

      expect(eurocampClientService.createParc).toHaveBeenCalledWith(createParcDto);
      expect(result).toEqual(createdParc);
    });
  });

  describe('deleteParc', () => {
    it('should delete parc successfully', async () => {
      mockEurocampClientService.deleteParc.mockResolvedValue(undefined);

      await controller.deleteParc('1');

      expect(eurocampClientService.deleteParc).toHaveBeenCalledWith('1');
    });
  });
});