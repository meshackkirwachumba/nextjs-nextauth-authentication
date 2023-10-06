import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import User from "./components/user";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main className="">
      <h1>Hello Authentication</h1>
      <h1>Server Side Rendered Component</h1>
      <p>{JSON.stringify(session)}</p>
      <br />
      <br />
      <User />
    </main>
  );
}
