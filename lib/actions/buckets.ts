"use server";
import { auth } from "@/auth";
import { s3Client } from "@/lib/s3";
import { basePrefix } from "@/lib/config";
import { CreateBucketCommand, ListBucketsCommand } from "@aws-sdk/client-s3";

export async function getUserBuckets() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const { preferredUsername } = session.user;

  const Prefix = `${basePrefix}-${preferredUsername}-`;

  return await s3Client.send(new ListBucketsCommand({ Prefix }));
}

export async function createBucket(prevState: any, bucketName: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", data: null };

  const { preferredUsername } = session.user;

  const Bucket = `${basePrefix}-${preferredUsername}-${bucketName}`;

  try {
    await s3Client.send(
      new CreateBucketCommand({
        Bucket,
      }),
    );
    return { error: null, data: { Bucket } };
  } catch (error: any) {
    console.error(error);
    return { error: error.message, data: null };
  }
}
