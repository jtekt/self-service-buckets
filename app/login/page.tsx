"use client";
import SignIn from "@/components/sign-in";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session, status } = useSession();

  return (
    <div>
      <h2 className="text-h2">Login</h2>
      {status === "loading" ? (
        <div>Loading</div>
      ) : session ? (
        <>
          <div>You are signed in as {JSON.stringify(session.user)}</div>
          <div>
            <a href="/">Back to home screen</a>
          </div>
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
