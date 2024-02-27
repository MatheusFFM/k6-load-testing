import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { PrismaService } from '../prisma/prisma.service';

const testGame1 = 'Test Game 1';
const testGame1Price = 294.5;
const testGame1Id = 1;

const gameArray = [
  { id: testGame1Id, title: testGame1, price: testGame1Price },
  { id: 2, title: 'Test Game 2', price: 48.3 },
  { id: 3, title: 'Test Game 3', price: 114.9 },
];

const firstTestGame = gameArray[0];

const db = {
  game: {
    findMany: jest.fn().mockResolvedValue(gameArray),
    findUnique: jest.fn().mockResolvedValue(firstTestGame),
    findFirst: jest.fn().mockResolvedValue(firstTestGame),
    create: jest.fn().mockReturnValue(firstTestGame),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(firstTestGame),
    delete: jest.fn().mockResolvedValue(firstTestGame),
  },
};

describe('GamesService', () => {
  let service: GamesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of games', async () => {
      const games = await service.findAll();
      expect(games).toEqual(gameArray);
    });
  });

  describe('getOne', () => {
    it('should get a single game', () => {
      expect(service.findOne(testGame1Id)).resolves.toEqual(firstTestGame);
    });
  });

  describe('insertOne', () => {
    it('should successfully insert a game', () => {
      const game = service.create({
        title: testGame1,
        price: testGame1Price,
      });
      expect(game).toEqual(firstTestGame);
    });
  });

  describe('updateOne', () => {
    it('should call the update game method', async () => {
      const game = await service.update(1, {
        title: testGame1,
        price: testGame1Price,
      });
      expect(game).toEqual(firstTestGame);
    });
  });

  describe('deleteOne', () => {
    it('should return {deleted: true}', () => {
      expect(service.remove(testGame1Id)).resolves.toEqual({ deleted: true });
    });

    it('should return {deleted: false, message: err.message}', () => {
      const dbSpy = jest
        .spyOn(prisma.game, 'delete')
        .mockRejectedValueOnce(new Error('Bad Delete Method.'));
      expect(dbSpy).toHaveBeenCalled();
      expect(service.remove(5)).resolves.toEqual({
        deleted: false,
        message: 'Bad Delete Method.',
      });
    });
  });
});
