import { defineScript } from 'redis';
import unlockScript from '../scripts/unlock.lua?raw';

export const unlockDef = defineScript({
  NUMBER_OF_KEYS: 1,
  SCRIPT: unlockScript,
  transformArguments(key: string, token: string) {
    return [key, token];
  },
  transformReply(reply: any) {
    return reply;
  },
});
