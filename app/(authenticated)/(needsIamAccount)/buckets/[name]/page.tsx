import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ReturnTo from "@/components/return-to";
import { DatabaseIcon, KeyIcon } from "lucide-react";
import { getUserBucketByName } from "@/lib/actions/buckets";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import DeleteBucket from "@/components/delete-bucket-btn";
import { notFound } from "next/navigation";

export default async function BucketPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const awaitedParams = await params;
  const bucketName = awaitedParams.name;

  const bucket = await getUserBucketByName(bucketName);

  if (!bucket) {
    notFound()
  }

  return (
    <div className="space-y-4">
      <ReturnTo to="/buckets" />

      <div className="flex items-center gap-2 px-1">
        <DatabaseIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">{bucketName}</h1>
        <div className="grow" />
        <DeleteBucket name={bucketName} />
      </div>

      <Card>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="endpoint">Endpoint</FieldLabel>
              <Input
                id="endpoint"
                value={process.env.S3_ENDPOINT || "https://s3.amazonaws.com"}
                readOnly
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bucket-name">Bucket name</FieldLabel>
              <Input id="bucket-name" value={bucketName} readOnly />
            </Field>

            <Field>
              <FieldLabel>Region</FieldLabel>
              <Input value={bucket?.BucketRegion} readOnly />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Alert variant="warning">
            <KeyIcon />
            <AlertTitle>Security Note</AlertTitle>
            <AlertDescription>
              Use your IAM Access Key and Secret Key to authenticate. This
              bucket is restricted to your user account.
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>
    </div>
  );
}
