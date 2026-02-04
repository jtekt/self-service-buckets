"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createBucket, dummyAction } from "@/app/actions";
import { useActionState, startTransition } from "react";

const formSchema = z.object({
  bucketName: z
    .string()
    .min(3, "Please provide at least 10 characters.")
    .max(20, "Please keep it under 200 characters."),
});

export default function FormRhfTextarea() {
  const { data: session, status } = useSession();

  const [state, action, pending] = useActionState(createBucket, null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bucketName: "",
    },
  });

  function onSubmit({ bucketName }: z.infer<typeof formSchema>) {
    startTransition(() => {
      action(bucketName);
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create bucket</CardTitle>
        {/* <CardDescription>
          Customize your experience by telling us more about yourself.
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <form id="form-rhf-textarea" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="bucketName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-textarea-about">
                    Bucket name
                  </FieldLabel>
                  {/* <Textarea
                    {...field}
                    id="form-rhf-textarea-about"
                    aria-invalid={fieldState.invalid}
                    placeholder="I'm a software engineer..."
                    className="min-h-[120px]"
                  /> */}

                  <div className="flex items-center">
                    <div className="whitespace-nowrap">
                      self-service-buckets
                    </div>
                    <div>-</div>
                    {/* TODO: typescript */}
                    <div>{session?.user?.preferredUsername || "unknown"}</div>
                    <div>-</div>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="my-bucket"
                    />
                  </div>

                  <FieldDescription>Lowercase only</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        {state?.error && <div>An error occured</div>}
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-textarea">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
