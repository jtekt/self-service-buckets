"use client";
import { createKeys } from "@/lib/actions/users";
import ReturnHome from "@/components/return-home";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DownloadIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { startTransition, useActionState, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function Page() {
  const [secretVisible, setSecretVisibility] = useState(false);
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
        <div className="flex flex-col gap-6 my-6">
          {/* TODO: download as file */}
          <div className="text-destructive">This will not be shown again</div>

          <FieldGroup className="grid max-w-sm grid-cols-1">
            <Field>
              <FieldLabel htmlFor="access-key-id">Access key ID</FieldLabel>
              <Input
                id="access-key-id"
                value={state.data.AccessKeyId}
                readOnly
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="access-secret-key">
                Secret access key
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="access-secret-key"
                  value={state.data.SecretAccessKey}
                  readOnly
                  type={secretVisible ? "text" : "password"}
                />

                <InputGroupAddon align="inline-end">
                  <Button
                    onClick={() => setSecretVisibility(!secretVisible)}
                    variant="ghost"
                  >
                    {secretVisible ? <EyeIcon /> : <EyeOffIcon />}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </FieldGroup>
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
