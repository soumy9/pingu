import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { FC } from "react";

interface PageProps {}

const Page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    //notFound();
    return <></>;
  }
  // ids of people who sent requests to this user
  const incomingSenderIds = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as string[];
  const incomingFriendRequests: IncomingFriendRequest[] = await Promise.all(
    incomingSenderIds.map(async (incomingSenderId) => {
      const sender = (await fetchRedis(
        "get",
        `user:${incomingSenderId}`
      )) as string;
			const senderParsed = JSON.parse(sender);
			
      return {
        senderId: incomingSenderId,
        senderEmail: senderParsed.email,
      };
    })
  );
	
  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <div className="flex flex-col gap-4">
        <FriendRequests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id}/>
      </div>
    </main>
  );
};

export default Page;
