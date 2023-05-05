"use client";
import { FriendRequestProvider } from "@/context/AppContext";
import { FC, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
interface ProvidersProps {
  children: ReactNode;
}

const Providers: FC<ProvidersProps> = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <FriendRequestProvider>{children}</FriendRequestProvider>
    </>
  );
};

export default Providers;
