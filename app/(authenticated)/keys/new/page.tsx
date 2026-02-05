"use client";
import { createKeys } from "@/lib/actions/users";
import ReturnHome from "@/components/return-home";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DownloadIcon } from "lucide-react";
import { startTransition, useActionState } from "react";

export default function Page() {
  const [state, action, pending] = useActionState(createKeys, null);

  function onClick() {
    startTransition(() => action());
  }

  function downloadAsJson() {
    if (!state?.data) return;
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(state.data))}`;
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", "self-service-buckets-keys.json");
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div>
      <ReturnHome />
      <h2 className="text-2xl my-2">Create keys</h2>
      <div>
        <Button disabled={pending || !!state?.data} onClick={onClick}>
          Create keys
        </Button>
      </div>

      {state?.data && (
        <div className="flex flex-col gap-6">
          {/* TODO: download as file */}
          <div className="text-destructive">This will not be shown again</div>
          <Field>
            <FieldLabel htmlFor="access-key-id">Access key ID</FieldLabel>
            <Input id="access-key-id" value={state.data.AccessKeyId} readOnly />
          </Field>

          <Field>
            <FieldLabel htmlFor="access-secret-key">
              Secret access key
            </FieldLabel>
            <Input
              id="access-secret-key"
              value={state.data.SecretAccessKey}
              readOnly
            />
          </Field>
          <div>
            <Button onClick={downloadAsJson}>
              <DownloadIcon />
              <span>Download keys</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
