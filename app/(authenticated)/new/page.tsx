"use client";
import { createIamUser } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { startTransition, useActionState } from "react";

export default function Page() {
  const { data: session, status } = useSession();

  const [state, action, pending] = useActionState(createIamUser, null);

  function onclick() {
    startTransition(() => action());
  }

  return (
    <div>
      <h2 className="text-2xl my-2">Create account</h2>
      <div>
        <Button>Create account {session?.user.preferredUsername}</Button>
      </div>
    </div>
  );
}
