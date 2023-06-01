import Dashboard from "@/components/Dashboard";
import FriendRequestSidebarOptions from "@/components/FriendRequestSidebarOptions";
import { Icon, Icons } from "@/components/Icons";
import SidebarChatList from "@/components/SidebarChatList";
import SignOutButton from "@/components/SignOutButton";
import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { Menu } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    notFound();
  }

  const initialUnseenRequestsCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

	const user: User & {
		id: string
	} = {id: session.user.id || '',image: session.user.image || '',email: session.user.email || '', name: session.user.name || ''};

  const friends = await getFriendsByUserId(session.user.id);

  return (
    <div className="w-full flex h-screen relative">
      <Dashboard user={user} friends={friends} initialUnseenRequestsCount={initialUnseenRequestsCount}>
				{children}
			</Dashboard>
    </div>
  );
};

export default Layout;
