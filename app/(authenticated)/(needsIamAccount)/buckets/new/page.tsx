"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { createBucket } from "@/lib/actions/buckets";
import { useActionState, startTransition, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { DatabaseIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ReturnTo from "@/components/return-to";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  bucketName: z
    .string()
    .min(3, "Please provide at least 3 characters.")
    .max(20, "Please keep it under 20 characters.")
    .regex(
      /^(?!^xn--)(?!^.*--ol-s3$)(?!^([0-9]+\.){3}[0-9]+$)(?!.*\.{2})[a-z0-9][a-z0-9\-\.]{1,61}[a-z0-9]$/,
      "Bucket name is invalid",
    ),
});

export default function CreateBucketPage() {
  const { data: session, status } = useSession();
  const [state, action, pending] = useActionState(createBucket, null);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { bucketName: "" },
  });

  function onSubmit({ bucketName }: z.infer<typeof formSchema>) {
    startTransition(() => action(bucketName));
  }

  useEffect(() => {
    if (state?.data) {
      toast.success(`Bucket "${state.data.Bucket}" was created successfully.`);
      router.push("/buckets/" + state.data.Bucket);
    }
  }, [state, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ReturnTo to="/buckets" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DatabaseIcon className="h-5 w-5" />
            Create bucket
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form id="create-bucket" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="bucketName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Bucket name</FieldLabel>

                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>
                          self-service-buckets-
                          {session?.user?.preferredUsername}-
                        </InputGroupText>
                      </InputGroupAddon>

                      <InputGroupInput
                        id="name"
                        {...field}
                        placeholder="my-bucket"
                        disabled={pending}
                        autoFocus
                      />
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <div className="p-4 pt-0">
          <Button
            type="submit"
            form="create-bucket"
            disabled={pending}
            className="w-full"
          >
            {pending ? (
              <span className="flex items-center gap-2">
                <Spinner data-icon="inline-start" />
                Creating bucket…
              </span>
            ) : (
              "Create bucket"
            )}
          </Button>
        </div>
      </Card>

      {!pending && state?.error && (
        <Alert variant="destructive">
          <AlertTitle>Unable to create bucket</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
