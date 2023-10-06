"use client";

import { signOut, useSession } from "next-auth/react";

const Dashboard = () => {
  const { data: session } = useSession();
  return (
    <div>
      <h1>Hi</h1>
      <p>{session?.user?.email}</p>

      <button onClick={() => signOut()}>Log outS</button>
    </div>
  );
};

export default Dashboard;
