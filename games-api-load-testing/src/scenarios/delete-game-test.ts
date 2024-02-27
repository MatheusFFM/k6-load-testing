import { sleep, check, fail } from 'k6';
import http from 'k6/http';
import { Trend } from 'k6/metrics';

export const deleteGameDuration = new Trend('delete_game_duration');
export const deleteGameFailRate = new Trend('delete_game_fail_rate');
export const deleteGameSuccessRate = new Trend('delete_game_success_rate');

export const options = {
  stages: [
    { duration: '20s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '20s', target: 0 },
  ],
  noConnectionReuse: true,
};

export default () => {
  const id = -1;
  const res = http.del(`http://localhost:3000/games/${id}`);

  deleteGameDuration.add(res.timings.duration);
  deleteGameFailRate.add(res.status !== 200);
  deleteGameSuccessRate.add(res.status === 200);

  const maxDuration = 1000;
  const durationMessage = `Max duration ${maxDuration / 1000}s`;

  if (
    check(res, { 'Delete Game - Status code 200': (r) => r.status === 200 })
  ) {
    console.info('Delete - Status OK');
  } else {
    console.error(
      `Error when calling DELETE http://localhost:3000/games/${id}\n Status code:${res.status}\n`,
    );
  }

  if (
    !check(res, {
      'Delete Game - Max duration': (r) => r.timings.duration < maxDuration,
    })
  ) {
    fail(durationMessage);
  }

  sleep(0.2);
};
