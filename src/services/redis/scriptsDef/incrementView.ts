import { defineScript } from 'redis';
import incrementViewScript from '../scripts/incrementView.lua?raw';
import { itemsByViewsKey, itemsKey, itemsViewsKey } from '$services/keys';

export const incrementViewDef = defineScript({
  NUMBER_OF_KEYS: 3,
  SCRIPT: incrementViewScript,
  transformArguments(itemId: string, userId: string) {
    return [
      itemsViewsKey(itemId), // => items:views#asdfg
      itemsKey(itemId), // => items#asdfg
      itemsByViewsKey(), // => items:views
      itemId, // => asdfg
      userId, // => u123
    ];

    // EVALSHA ID 3 items:views#asdfg items#asdfg items:views asdfg u123
  },
  transformReply() {},
});
