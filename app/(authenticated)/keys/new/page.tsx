"use client";
import { createKeys } from "@/app/actions";
import ReturnHome from "@/components/return-home";
import { Button } from "@/components/ui/button";
import { startTransition, useActionState } from "react";

export default function Page() {
  const [state, action, pending] = useActionState(createKeys, null);

  function onClick() {
    startTransition(() => action());
  }

  return (
    <div>
      <ReturnHome />
      <h2 className="text-2xl my-2">Create keys</h2>
      <div>
        <Button disabled={pending} onClick={onClick}>
          Create keys
        </Button>
      </div>

      {state?.data && (
        <div>
          {/* TODO: download as file */}
          <div className="text-destructive">This will only be shown once!</div>
          <div>Access key ID: {state.data.AccessKeyId}</div>
          <div>Secret access key: {state.data.SecretAccessKey}</div>
        </div>
      )}
    </div>
  );
}
