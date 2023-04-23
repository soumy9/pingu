const upstashRedisRestUrl = process.env.UPSTASH_REDIS_REST_URL;
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// these are the operations that we can do on a redis DB
type Command = "zrange" | "sismember" | "get" | "smembers";

export async function fetchRedis(
  command: Command,
  ...args: (string | number)[]
) {
  const commandUrl = `${upstashRedisRestUrl}/${command}/${args.join("/")}`;
  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });
	if(!response.ok) {
		throw new Error(`Error executing redis command: ${response.statusText}`);
	}
	const data = await response.json() as {result: any};
	return data.result;
}
