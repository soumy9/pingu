import { FC } from "react";
import { Icons } from "../Icons";
import BrandLogo from "./BrandLogo";

interface BurgerMenuProps {
	menuBtnClickHandler: ()=>void;
	className?: string;
}

const BurgerMenu: FC<BurgerMenuProps> = ({
	menuBtnClickHandler,
	className
}) => {
  return (
    <div className={`flex flex-row pt-4 items-baseline${' '+className??''}`}>
      <button
        className="md:hidden self-start pr-3"
        onClick={menuBtnClickHandler}
      >
        <Icons.Menu />
      </button>
			<BrandLogo />
    </div>
  );
};

export default BurgerMenu;
