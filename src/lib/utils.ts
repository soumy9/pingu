import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const chatHrefConstructor = (id1: string, id2: string) => {
  const sortedIds = [id1, id2].sort();
  return `${sortedIds[0]}--${sortedIds[1]}`;
};

export const toPusherKey = (key: string): string => {
  return key.replace(/:/g, "__");
};

export const friendRequestSocket = (
  sessionId: string
): { channel: string; event: string } => {
  return {
    channel: toPusherKey(`user:${sessionId}:incoming_friend_requests`),
    event: "incoming_friend_requests",
  };
};

export const messageSocket = (
  chatId: string
): { channel: string; event: string } => {
  return {
    channel: toPusherKey(`chat:${chatId}:messages`),
    event: "incoming_message",
  };
};

export const newMessageSocket = (
  senderId: string,
	receiverId:string
): { channel: string; event: string } => {
  return {
    channel: toPusherKey(`chat:${senderId}:${receiverId}`),
    event: "new_incoming_message",
  };
};