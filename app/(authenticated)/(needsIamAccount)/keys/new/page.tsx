"use client";

import { createKeys } from "@/lib/actions/users";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  AlertTriangleIcon,
  DownloadIcon,
  KeyIcon,
} from "lucide-react";
import { startTransition, useActionState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ReturnTo from "@/components/return-to";

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

  if (!state?.data) {
    return (
      <div className="space-y-4">
        <ReturnTo to="/keys" />

        <header className="space-y-1">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <KeyIcon className="h-5 w-5" />
            Create access keys
          </h2>
          <p className="text-sm text-muted-foreground">
            These credentials allow programmatic access to your buckets.
          </p>
        </header>

        <Button onClick={onClick} disabled={pending || !!state?.data}>
          {pending ? (
            <span className="flex items-center gap-2">
              <Spinner data-icon="inline-start" />
              Creating keys…
            </span>
          ) : (
            "Generate access keys"
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ReturnTo to="/keys" />

      <Alert className="w-full border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-50">
        <AlertTriangleIcon />
        <AlertTitle>This secret will not be shown again.</AlertTitle>
        <AlertDescription>
          Store it securely before leaving this page.
        </AlertDescription>
      </Alert>

      <FieldGroup className="space-y-4 rounded-md border p-4">
        <Field>
          <FieldLabel htmlFor="access-key-id">Access key ID</FieldLabel>
          <Input id="access-key-id" value={state.data.AccessKeyId} readOnly />
        </Field>

        <Field>
          <FieldLabel htmlFor="access-secret-key">Secret access key</FieldLabel>
          <Input
            id="access-secret-key"
            value={state.data.SecretAccessKey}
            readOnly
          />
        </Field>
      </FieldGroup>
      <Button onClick={downloadAsJson}>
        <DownloadIcon />
        <span>Download keys</span>
      </Button>
    </div>
  );
}
