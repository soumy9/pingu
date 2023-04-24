// export  is not required b/c you have declared this type inside something.d.ts
interface IncomingFriendRequest {
  senderId: string;
  senderEmail: string | null | undefined;
}
