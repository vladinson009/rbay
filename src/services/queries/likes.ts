import { client } from '$services/redis';
import { userLikesKey, itemsKey } from '$services/keys';
import { getItems } from './items';

export const userLikesItem = async (itemId: string, userId: string) => {
  return client.sIsMember(userLikesKey(userId), itemId);
};

export const likedItems = async (userId: string) => {
  // Fetch all the item ID's from this user's liked set
  const ids = await client.sMembers(userLikesKey(userId));

  // Fetch all the item hashes with thoose ids and return as array
  return getItems(ids);
};

export const likeItem = async (itemId: string, userId: string) => {
  const isInserted = await client.sAdd(userLikesKey(userId), itemId);
  if (isInserted) {
    return client.hIncrBy(itemsKey(itemId), 'likes', 1);
  }
};

export const unlikeItem = async (itemId: string, userId: string) => {
  const isInserted = await client.sRem(userLikesKey(userId), itemId);
  if (isInserted) {
    return client.hIncrBy(itemsKey(itemId), 'likes', -1);
  }
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
  const ids = await client.sInter([
    userLikesKey(userOneId),
    userLikesKey(userTwoId),
  ]);

  return getItems(ids);
};
