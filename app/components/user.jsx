"use client";

import { useSession, signIn, signOut } from "next-auth/react";

const User = () => {
  const { data: session } = useSession();
  return (
    <div>
      <h1>Client Side Rendered Component</h1>
      {JSON.stringify(session)}
    </div>
  );
};

export default User;
