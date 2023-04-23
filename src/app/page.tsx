import Button from "@/components/ui/Button";
import { db } from "@/lib/db";

export default async function Home() {
  db.set("hello", "hello");

  return <Button isLoading={true}>Hello World</Button>
}
