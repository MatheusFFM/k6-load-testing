import { sleep, check, fail } from 'k6';
import http from 'k6/http';
import { Trend } from 'k6/metrics';

export const getGameDuration = new Trend('get_game_duration');
export const getGameFailRate = new Trend('get_game_fail_rate');
export const getGameSuccessRate = new Trend('get_game_success_rate');

export const options = {
  stages: [
    { duration: '20s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '20s', target: 0 },
  ],
  noConnectionReuse: true,
};

export default () => {
  const id = 1;
  const res = http.get(`http://localhost:3000/games/${id}`);

  getGameDuration.add(res.timings.duration);
  getGameFailRate.add(res.status !== 200);
  getGameSuccessRate.add(res.status === 200);

  const maxDuration = 1000;
  const durationMessage = `Max duration ${maxDuration / 1000}s`;

  if (check(res, { 'Get game - Status code 200': (r) => r.status === 200 })) {
    console.info('Get game - Status OK');
  } else {
    console.error(
      `Error when calling GET http://localhost:3000/games/${id}\n Status code:${res.status}\n`,
    );
  }

  if (
    !check(res, {
      'Get game - Max duration': (r) => r.timings.duration < maxDuration,
    })
  ) {
    fail(durationMessage);
  }

  sleep(0.2);
};
