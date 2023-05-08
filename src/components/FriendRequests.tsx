"use client";
import { FriendRequestContext } from "@/context/AppContext";
import { pusherClient } from "@/lib/pusher";
import { friendRequestSocket, toPusherKey } from "@/lib/utils";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useContext, useEffect, useState } from "react";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );
  const { dispatch } = useContext(FriendRequestContext);
  const router = useRouter();
  const acceptFriend = async (senderId: string) => {
    console.log("acceptFriend");

    await axios.post("/api/friends/accept", {
      id: senderId,
    });
    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );
		dispatch({
			type: "decrement-request-count",
			payload: {}
		});
    router.refresh();
  };
  const denyFriend = async (senderId: string) => {
    await axios.post("/api/friends/deny", {
      id: senderId,
    });
    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );
		dispatch({
			type: "decrement-request-count",
			payload: {}
		});
    router.refresh();
  };

  useEffect(() => {
    const { channel, event } = friendRequestSocket(sessionId);
    const friendRequestsHandler = (data: IncomingFriendRequest) => {
      setFriendRequests((prev) => [...prev, data]);
    };
    pusherClient.subscribe(channel);
    pusherClient.bind(event, friendRequestsHandler);

    return () => {
      pusherClient.unsubscribe(channel);
      pusherClient.unbind(event, friendRequestsHandler);
    };
  }, []);
  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className="flex gap-4 items-center">
            <UserPlus className="text-black" />
            <p className="font-medium text-lg">{request.senderEmail}</p>
            <button
              onClick={() => acceptFriend(request.senderId)}
              aria-label="accept friend"
              className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </button>
            <button
              onClick={() => denyFriend(request.senderId)}
              aria-label="deny friend"
              className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
            >
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
