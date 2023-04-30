import { fetchRedis } from "./redis";

export const getFriendsByUserId = async (userId: string) => {
  const friendIds = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`
  )) as string[];
  // METHOD: 1
  const friends = await Promise.all(
    friendIds.map((id) => {
      return fetchRedis("get", `user:${id}`) as Promise<string>;
    })
  );

  const friendsParsed = friends.map((friend) => JSON.parse(friend) as User);
  return friendsParsed;

  // METHOD: 2
  /* OR THE FOLLOWING CODE DOES THE SAME THING TO GET FRIENDS EMAILS:
	const friends = await Promise.all(
    friendIds.map(async (id) => {
      const friend = await fetchRedis("get", `user:${id}`) as User;
			return friend.email;
    })
  );
	*/
};
