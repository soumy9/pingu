interface User {
  name: string;
  email: string;
  image: string;
  id: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

interface ExtendedMessage extends Message {
	senderName: string;
	senderProfileImg: string;
}

interface Chat {
  id: string;
  messages: Messages[];
}

interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
}
