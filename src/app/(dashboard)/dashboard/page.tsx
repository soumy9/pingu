import { FC } from "react";
import {getServerSession} from 'next-auth';

interface PageProps {}

const Page= async () => {

  const session = await getServerSession()
	return <p>Dashboard</p>;
};

export default Page;
