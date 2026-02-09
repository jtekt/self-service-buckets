import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ReturnTo from "@/components/return-to";
import { KeyIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { getUserKeyById } from "@/lib/actions/users";
import { notFound } from "next/navigation";
import DeleteKey from "@/components/delete-key-btn";
import { Badge } from "@/components/ui/badge";
import { keyStatusVariant } from "@/lib/keys";

export default async function KeyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: accessKeyId } = await params;

  const result = await getUserKeyById(accessKeyId);
  if (!result) {
    notFound();
  }

  const { Status, CreateDate } = result;

  return (
    <div className="space-y-4">
      <ReturnTo to="/keys" />

      <div className="flex items-center gap-2 px-1">
        <KeyIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">{accessKeyId}</h1>
        <Badge variant={Status ? keyStatusVariant[Status] : undefined}>
          {Status}
        </Badge>
        <div className="grow" />
        <DeleteKey accessKeyId={accessKeyId} />
      </div>

      <Card>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="access-key-id">Access Key ID</FieldLabel>
              <Input id="access-key-id" value={accessKeyId} readOnly />
            </Field>

            <Field>
              <FieldLabel htmlFor="created-at">Created At</FieldLabel>
              <Input
                id="created-at"
                value={
                  CreateDate ? new Date(CreateDate).toLocaleString() : "Never"
                }
                readOnly
              />
            </Field>
          </FieldGroup>
        </CardContent>

        <CardFooter>
          <Alert variant="warning">
            <KeyIcon className="h-4 w-4" />
            <div>
              <AlertTitle>Security Notice</AlertTitle>
              <AlertDescription>
                This access key grants programmatic access to AWS services. Keep
                the secret key secure and rotate or delete the key if it is no
                longer needed.
              </AlertDescription>
            </div>
          </Alert>
        </CardFooter>
      </Card>
    </div>
  );
}
