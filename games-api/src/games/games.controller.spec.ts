import { Test, TestingModule } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateGameDto } from './dto/update-game.dto';
import { CreateGameDto } from './dto/create-game.dto';

const testGame1 = 'Test Game 1';
const testGame1Price = 294.5;
const testGame1Id = 1;

const gameArray = [
  { id: testGame1Id, title: testGame1, price: testGame1Price },
  { id: 2, title: 'Test Game 2', price: 48.3 },
  { id: 3, title: 'Test Game 3', price: 114.9 },
];

const firstTestGame = gameArray[0];

describe('GamesController', () => {
  let controller: GamesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        {
          provide: GamesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(gameArray),
            findOne: jest
              .fn()
              .mockImplementation((id: number) =>
                Promise.resolve(gameArray.find((g) => g.id === id)),
              ),
            update: jest
              .fn()
              .mockImplementation(
                (id: number, updateGameDto: UpdateGameDto) => ({
                  id,
                  ...updateGameDto,
                }),
              ),
            create: jest
              .fn()
              .mockImplementation((createGameDto: CreateGameDto) => ({
                id: testGame1Id,
                ...createGameDto,
              })),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should get an array of games', async () => {
      await expect(controller.findAll()).resolves.toEqual(gameArray);
    });
  });

  describe('findOne', () => {
    it('should get a single game', async () => {
      await expect(controller.findOne(testGame1Id.toString())).resolves.toEqual(
        firstTestGame,
      );
    });
  });

  describe('create', () => {
    it('should create a new game', () => {
      const createGameDto: CreateGameDto = {
        title: 'Test Game 4',
        price: 290.33,
      };
      expect(controller.create(createGameDto)).toEqual({
        id: testGame1Id,
        ...createGameDto,
      });
    });
  });

  describe('update', () => {
    it('should update a game', () => {
      const updateGameDto: UpdateGameDto = {
        title: 'Test Game 4',
        price: 290.33,
      };
      expect(controller.update(testGame1Id.toString(), updateGameDto)).toEqual({
        id: testGame1Id,
        ...updateGameDto,
      });
    });
  });

  describe('deleteCat', () => {
    it('should return that it deleted a cat', async () => {
      await expect(controller.remove(testGame1Id.toString())).resolves.toEqual({
        deleted: true,
      });
    });
  });
});
