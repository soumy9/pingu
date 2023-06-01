import { FC } from "react";
import { Icons } from "../Icons";

interface BrandLogoProps {}

const BrandLogo: FC<BrandLogoProps> = ({}) => {
  return (
    <div className="flex flex-row border-2 border-solid border-indigo-100 text-indigo-600 w-fit">
      <Icons.Logo className="h-8 w-auto text-indigo-600 -rotate-45" />
      <h1 className="text-indigo-600 font-medium text-2xl">Pingu</h1>
    </div>
  );
};

export default BrandLogo;
