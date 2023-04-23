import { FC } from "react";
import {getServerSession} from 'next-auth';

interface pageProps {}

const Page: FC<pageProps> = async () => {

  const session = await getServerSession()
	return <pre>{JSON.stringify(session)}</pre>;
};

export default Page;
