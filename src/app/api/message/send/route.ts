import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { messageSocket, newMessageSocket } from "@/lib/utils";
import { messageSchema } from "@/lib/validations/message";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // validate the message schema
    const { text, chatId } = body as { text: string; chatId: string };

    const session = await getServerSession(authOptions);
    console.log({ session });

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const [userId1, userId2] = chatId.split("--");

    console.log({ userId1, userId2 });

    if (session.user.id !== userId1 && session.user.id !== userId2) {
      return new Response("Unauthorized", { status: 401 });
    }
    const friendId = userId1 === session.user.id ? userId2 : userId1;

    const isSenderInFriendList = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      friendId
    );
    console.log({ isSenderInFriendList });

    if (!isSenderInFriendList) {
      return new Response("Unauthorized", { status: 401 });
    }
    const rawSender = (await fetchRedis(
      "get",
      `user:${session.user.id}`
    )) as string;
    const sender = JSON.parse(rawSender) as User;
    const timestamp = Date.now();
    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
      receiverId: friendId,
    };
    const message = messageSchema.parse(messageData);

    // notify all connected chat room clients

    // all valid, send message
    const { event, channel } = messageSocket(chatId);
    await pusherServer.trigger(channel, event, message);

    // all valid, send message
    const { event: new_msg_event, channel: new_msg_channel } = newMessageSocket(
      session.user.id,
      friendId
    );
    await pusherServer.trigger(new_msg_channel, new_msg_event, message);
		// when a new message is sent, you have to send it to FE

    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });
    return new Response("OK");
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
