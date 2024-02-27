import { sleep, group } from 'k6';
import getGames from './scenarios/get-games-test';
import getGame from './scenarios/get-game-test';
import deleteGame from './scenarios/delete-game-test';

export const options = {
  stages: [
    { duration: '20s', target: 10 }, // simulate ramp-up of traffic from 1 to 100 users over 10 seconds.
    { duration: '1m', target: 10 }, // stay at 100 users for 1 minute
    { duration: '20s', target: 0 }, // ramp-down to 0 users
  ],
  noConnectionReuse: true,
};

export default () => {
  group('Games Resource', () => {
    getGames();
    getGame();
    deleteGame();
  });

  sleep(1);
};
