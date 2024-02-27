import { sleep, check, fail } from 'k6';
import http from 'k6/http';

const params = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const options = {
  vus: 1,
  iterations: 1,
};

export const setup = () => {
  const data = JSON.stringify({
    title: `Test load balance update: ${__VU}`,
    description: 'Waiting for test...',
    price: 0,
  });
  const res = http.post(`http://localhost:3000/games`, data, params);

  const maxDuration = 2000;
  const durationMessage = `Create game to patch max duration ${maxDuration / 1000}s`;

  if (
    check(res, { 'Create game to patch - Status 201': (r) => r.status === 201 })
  ) {
    console.info('Create game to patch - Status OK');
  } else {
    console.error(
      `Error when calling POST http://localhost:3000/games\n Status code:${res.status}\n`,
    );
  }

  if (
    !check(res, {
      'Create game to patch - max duration': (r) =>
        r.timings.duration < maxDuration,
    })
  ) {
    fail(durationMessage);
  }

  return res.json('id');
};

export default (id: string) => {
  const data = JSON.stringify({
    description: 'Testing...',
  });
  const res = http.patch(`http://localhost:3000/games/${id}`, data, params);

  const maxDuration = 2000;
  const durationMessage = `Patch game max duration ${maxDuration / 1000}s`;

  if (check(res, { 'Patch game - Status code 200': (r) => r.status === 200 })) {
    console.info('Patch game - Status OK');
  } else {
    console.error(
      `Error when calling PATCH http://localhost:3000/games/${id}\n Status code:${res.status}\n`,
    );
  }

  if (
    !check(res, {
      'Patch game - max duration': (r) => r.timings.duration < maxDuration,
    })
  ) {
    fail(durationMessage);
  }

  sleep(0.2);
};

export const teardown = (id: string) => {
  const res = http.del(`http://localhost:3000/games/${id}`);

  const maxDuration = 2000;
  const durationMessage = `Delete patched game max duration ${maxDuration / 1000}s`;

  check(res, {
    'Delete patched game - Deleted property true': (r) =>
      r.json('deleted') == true,
  });

  if (
    !check(res, {
      'Delete patched game - max duration': (r) =>
        r.timings.duration < maxDuration,
    })
  ) {
    fail(durationMessage);
  }
};
