import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";


// https://beta.nextjs.org/docs/routing/route-handlers
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("POST", { body });
    const { email: emailToAdd } = addFriendValidator.parse(body.email);
    console.log("email", { emailToAdd });
		const idToAdd = await fetchRedis('get', `user:email:${emailToAdd}`) as string;
    const RESTResponse = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: "no-store",
      }
    );
    const data = (await RESTResponse.json()) as { result: string | null };
    console.log({ data });
    //const idToAdd = data.result;
    if (!idToAdd) {
      return new Response("This person does not exist.", { status: 400 });
    }
    const session = await getServerSession(authOptions);
		console.log({session});
		
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (idToAdd === session.user.id) {
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });
    }

		//user1->sending friend request
		//user2->to whom request will be sent

    // check if user is already added
		//i.e. in user2's recieved requests, check if user1's id is already present
    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 0 | 1;
    if (isAlreadyAdded) {
      return new Response("Already added this user", { status: 400 });
    }

    // check if user is already Friends i.e. in friend list of user1
    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:friends`,
      idToAdd
    )) as 0 | 1;
    if (isAlreadyFriends) {
      return new Response("Already friends this user", { status: 400 });
    }

    //valid request, send friend request
    //here param1: key is the name of the set, param2: value to be added to set
		// so, in the set of incoming friend requests of user2, add user1 also
    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid Request", { status: 400 });
  }
}
