"use client";
import { createIamUser } from "@/lib/actions/users";
import ReturnHome from "@/components/return-home";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { startTransition, useActionState } from "react";

export default function Page() {
  const { data: session, status } = useSession();

  const [state, action, pending] = useActionState(createIamUser, null);

  function onClick() {
    startTransition(() => action());
  }

  return (
    <div>
      <ReturnHome />
      <h2 className="text-2xl my-2">Create account</h2>

      <div>
        <Button onClick={onClick} disabled={pending}>
          {/* TODO: loader */}
          Create account {session?.user.preferredUsername}
        </Button>
      </div>

      {state?.error && <div className="text-red-800">{state.error}</div>}
      {state?.data && <div>Created user {state.data.UserName}</div>}
    </div>
  );
}
