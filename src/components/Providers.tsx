"use client";
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
      {children}
    </>
  );
};

export default Providers;
