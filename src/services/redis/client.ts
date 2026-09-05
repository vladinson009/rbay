import { createClient } from 'redis';
import { createIndexes } from './create-indexes';

import { incrementViewDef } from './scriptsDef/incrementView';
import { unlockDef } from './scriptsDef/unlockDef';

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT!),
  },
  password: process.env.REDIS_PW,
  scripts: {
    // addOneAndStore: defineScript({
    //   NUMBER_OF_KEYS: 1,
    //   SCRIPT: `
    //     return redis.call('SET', KEYS[1], 1 + tonumber(ARGV[1]))
    //   `,
    //   transformArguments(key: string, value: number) {
    //     return [key, value.toString()];
    //     // ['books:count', '5']
    //     // EVALSHA <ID> 1 'books:count' '5'
    //   },
    //   transformReply(reply: any) {
    //     return reply;
    //   },
    // }),
    incrementView: incrementViewDef,
    unlock: unlockDef,
  },
});

client.on('error', (err) => console.error(err));
client.connect();
client.on('connect', async () => {
  try {
    await createIndexes();
  } catch (error) {
    console.error(error);
  }
});

export { client };
