"use client";
import ReturnHome from "@/components/return-home";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  return (
    <div>
      <ReturnHome />
      <h2 className="text-2xl">Login</h2>
      {status === "loading" ? (
        <div>Loading</div>
      ) : session ? (
        <>
          <div>You are signed in as {session.user.preferredUsername}</div>
          <div>
            <Button onClick={() => signOut()}>Logout</Button>
          </div>
        </>
      ) : (
        <Button onClick={() => signIn("keycloak")}>Login with Keycloak</Button>
      )}
    </div>
  );
}
