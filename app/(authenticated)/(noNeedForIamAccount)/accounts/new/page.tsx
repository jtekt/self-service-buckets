"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { createIamUser } from "@/lib/actions/users";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function Page() {
  const { data: session, status } = useSession();

  const router = useRouter();

  const [state, action, pending] = useActionState(createIamUser, null);

  useEffect(() => {
    if (state && state.data) {
      router.push("/");
    }
  }, [state]);

  if (status === "loading") {
    return (
      <div className="flex-1 mx-auto flex items-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Create IAM Account</h2>

      <p className="text-muted-foreground">
        An IAM account is required to manage buckets.
      </p>

      <Button onClick={() => action()} disabled={pending}>
        {pending ? (
          <span className="flex items-center gap-2">
            <Spinner data-icon="inline-start" />
            Creating account…
          </span>
        ) : (
          `Create account ${session?.user.preferredUsername}`
        )}
      </Button>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </div>
  );
}
