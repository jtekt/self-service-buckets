"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createBucket } from "@/lib/actions/buckets";
import { useActionState, startTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  CheckCircleIcon,
  DatabaseIcon,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import ReturnTo from "@/components/return-to";
import Link from "next/link";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { bucketName: "" },
  });

  function onSubmit({ bucketName }: z.infer<typeof formSchema>) {
    startTransition(() => action(bucketName));
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  /* ---------------- SUCCESS VIEW ---------------- */
  if (state?.data) {
    const { Bucket, Region} = state.data;

    return (
      <div className="space-y-4">
        <ReturnTo to="/buckets" />

        <Alert className="border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950/40 dark:text-green-50">
          <CheckCircleIcon className="h-4 w-4" />
          <AlertTitle>Bucket created</AlertTitle>
          <AlertDescription>
            Your bucket is ready to accept data.
          </AlertDescription>
        </Alert>

        <FieldGroup className="space-y-4 rounded-md border p-4">
          <Field>
            <FieldLabel>Bucket name</FieldLabel>
            <Input value={Bucket} readOnly />
          </Field>

          <Field>
            <FieldLabel>Region</FieldLabel>
            <Input value={Region} readOnly />
          </Field>
        </FieldGroup>

        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/buckets/${encodeURIComponent(Bucket)}`}>
              View bucket
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/buckets">
              Back to buckets
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------- FORM VIEW ---------------- */
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
    </div>
  );
}