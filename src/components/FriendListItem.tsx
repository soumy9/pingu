import { pusherClient } from "@/lib/pusher";
import {
  chatHrefConstructor,
  messageSocket,
  newMessageSocket,
} from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";

interface FriendListItemProps {
  friend: User;
  unseenMessages: Message[];
  sessionId: string;
}

const FriendListItem: FC<FriendListItemProps> = ({
  friend,
  unseenMessages,
  sessionId,
}) => {
  const [unseenMsgCount, setUnseenMsgCount] = useState<number>(
    unseenMessages?.filter((msg) => msg.senderId === friend.id).length || 0
  );
  const pathname = usePathname();

  const newMessageHandler = (msg: ExtendedMessage) => {
    if (
      pathname ===
      `/dashboard/chat/${chatHrefConstructor(friend.id, sessionId)}`
    ) {
      setUnseenMsgCount(0);
    } else {
      setUnseenMsgCount((prev) => prev + 1);
      // also show toast notification
      toast.custom((t) => {
        return (
          <UnseenChatToast
            t={t}
            senderId={msg.senderId}
            senderImg={friend.image}
            senderMessage={msg.text}
            senderName={friend.name}
            sessionId={msg.receiverId}
            key={msg.id}
          />
        );
      });
    }
  };

  useEffect(() => {
    // create a websocket connection to listen to any friend's messages
    const { event, channel } = newMessageSocket(friend.id, sessionId);
    pusherClient.subscribe(channel);

    pusherClient.bind(event, newMessageHandler);

    if (
      pathname ===
      `/dashboard/chat/${chatHrefConstructor(friend.id, sessionId)}`
    ) {
      setUnseenMsgCount(0);
    }

    return () => {
      pusherClient.unsubscribe(channel);
      pusherClient.unbind(event, newMessageHandler);
    };
  }, [pathname]);

  return (
    <li>
      <a
        href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}
        className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
      >
        {friend.name}
        {unseenMsgCount > 0 ? (
          <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
            {unseenMsgCount}
          </div>
        ) : null}
      </a>
    </li>
  );
};

export default FriendListItem;
