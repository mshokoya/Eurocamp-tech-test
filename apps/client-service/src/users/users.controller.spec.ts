import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { EurocampClientService } from '../services/eurocamp-client-api/eurocamp-client.service';
import { ApiClientException } from '../common/exceptions/api-exceptions';

describe('UsersController', () => {
  let controller: UsersController;
  let eurocampClientService: EurocampClientService;

  const mockEurocampClientService = {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: EurocampClientService,
          useValue: mockEurocampClientService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    eurocampClientService = module.get<EurocampClientService>(EurocampClientService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      ];

      mockEurocampClientService.getAllUsers.mockResolvedValue(mockUsers);

      const result = await controller.getAllUsers();

      expect(eurocampClientService.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('should handle service errors', async () => {
      mockEurocampClientService.getAllUsers.mockRejectedValue(
        new ApiClientException('Service unavailable', 503)
      );

      await expect(controller.getAllUsers()).rejects.toThrow(ApiClientException);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };

      mockEurocampClientService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getUserById('1');

      expect(eurocampClientService.getUserById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should handle user not found', async () => {
      mockEurocampClientService.getUserById.mockRejectedValue(
        new ApiClientException('User not found', 404)
      );

      await expect(controller.getUserById('999')).rejects.toThrow(ApiClientException);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto = { name: 'John Doe', email: 'john@example.com' };
      const createdUser = { id: '1', ...createUserDto };

      mockEurocampClientService.createUser.mockResolvedValue(createdUser);

      const result = await controller.createUser(createUserDto);

      expect(eurocampClientService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
    });

    it('should handle creation errors', async () => {
      const createUserDto = { name: 'John Doe', email: 'john@example.com' };

      mockEurocampClientService.createUser.mockRejectedValue(
        new ApiClientException('Bad request', 400)
      );

      await expect(controller.createUser(createUserDto)).rejects.toThrow(ApiClientException);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockEurocampClientService.deleteUser.mockResolvedValue(undefined);

      await controller.deleteUser('1');

      expect(eurocampClientService.deleteUser).toHaveBeenCalledWith('1');
    });

    it('should handle deletion errors', async () => {
      mockEurocampClientService.deleteUser.mockRejectedValue(
        new ApiClientException('User not found', 404)
      );

      await expect(controller.deleteUser('999')).rejects.toThrow(ApiClientException);
    });
  });
});