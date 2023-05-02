"use client";

import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, messageSocket } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import FriendListItem from "./FriendListItem";

interface SidebarChatListProps {
  friends: User[];
  sessionId: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
  const router = useRouter();
  const pathname = usePathname();

  // we want to run this fn every time the pathname changes
  useEffect(() => {
    // when user opens any chat, then we want to remove that particular chat from the unseen messages
    if (pathname?.includes("chat")) {
      // i.e. user has opened any chat
      setUnseenMessages((prev) =>
        prev?.filter((message) => !pathname.includes(message.senderId))
      );
    }
  }, [pathname]);

  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {friends.sort().map((friend) => {
        return (
          <FriendListItem
            friend={friend}
            unseenMessages={unseenMessages}
            sessionId={sessionId}
            key={friend.id}
          />
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
