import { randomBytes } from 'crypto';
import { client } from './client';

export const withLock = async (key: string, cb: () => any) => {
  // Iniitialize a few variables to control retry behavior
  const retryDelayMs = 100;
  let retries = 20;

  // Generate a random value to store at the lock key
  const token = randomBytes(6).toString('hex');

  // Create the lock key
  const lockKey = `lock:${key}`;

  // Set up a while loop to implement the retry behavior
  while (retries >= 0) {
    retries--;

    // Try to do a set NX operation
    const acquired = await client.set(lockKey, token, {
      NX: true,
      PX: 2000,
    });
    // ELSE brief pause (retryDelaysMs) and then retry
    if (!acquired) {
      await pause(retryDelayMs);
      continue;
    }
    // IF the set is successful, then run the callback
    try {
      // Unset the lock key
      const result = await cb();
      return result;
    } finally {
      await client.del(lockKey);
    }
  }
};

const buildClientProxy = () => {};

const pause = (duration: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};
