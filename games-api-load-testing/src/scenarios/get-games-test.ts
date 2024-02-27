import { sleep, check, fail } from 'k6';
import http from 'k6/http';
import { Trend } from 'k6/metrics';

export const getGamesDuration = new Trend('get_games_duration');
export const getGamesFailRate = new Trend('get_games_fail_rate');
export const getGamesSuccessRate = new Trend('get_games_success_rate');

export const options = {
  stages: [
    { duration: '20s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '20s', target: 0 },
  ],
  noConnectionReuse: true,
};

export default () => {
  const res = http.get('http://localhost:3000/games');

  getGamesDuration.add(res.timings.duration);
  getGamesFailRate.add(res.status !== 200);
  getGamesSuccessRate.add(res.status === 200);

  const maxDuration = 2000;
  const durationMessage = `Max duration ${maxDuration / 1000}s`;

  if (check(res, { 'Get games - Status code 200': (r) => r.status === 200 })) {
    console.info('Get games - Status OK');
  } else {
    console.error(
      `Error when calling GET http://localhost:3000/games\n Status code:${res.status}\n`,
    );
  }

  if (
    !check(res, {
      'Get games - Max duration': (r) => r.timings.duration < maxDuration,
    })
  ) {
    fail(durationMessage);
  }

  sleep(0.2);
};
