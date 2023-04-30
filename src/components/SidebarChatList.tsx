"use client";

import { chatHrefConstructor } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

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

  const [unseenMessages, setUnseenMessages] = useState<Message[]>();
  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {friends.sort().map((friend) => {
        const unseenMsgCount =
          unseenMessages?.filter((msg) => msg.senderId === friend.id).length ||
          0;
        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend.id
              )}`}
							className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
            >
              {friend.name}
              {unseenMsgCount > 0 ? (
                <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center"></div>
              ) : null}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
