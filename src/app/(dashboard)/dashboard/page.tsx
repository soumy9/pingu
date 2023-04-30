import { FC } from "react";
import {getServerSession} from 'next-auth';

interface pageProps {}

const Page: FC<pageProps> = async () => {

  const session = await getServerSession()
	return <p>Dashboard</p>;
};

export default Page;
