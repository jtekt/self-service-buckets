"use server";

import { addProxyToClient } from "aws-sdk-v3-proxy";
import {
  CreateBucketCommand,
  DeleteBucketCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { auth } from "@/auth";
import { BUCKETS_LIMIT } from "@/lib/config";
import { getBucketName, getBucketPrefix } from "../bucket";

const { HTTPS_PROXY, NODE_ENV } = process.env;

const s3Client = HTTPS_PROXY
  ? addProxyToClient(new S3Client({}))
  : new S3Client({});

export async function getUserBuckets() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const Prefix = getBucketPrefix(session);

  return await s3Client.send(new ListBucketsCommand({ Prefix }));
}

export async function createBucket(_: any, bucketName: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", data: null };

  const Bucket = getBucketName(session, bucketName);

  try {
    // Enforce bucket limit
    const userBuckets = await getUserBuckets();

    if (BUCKETS_LIMIT && (userBuckets.Buckets ?? []).length >= BUCKETS_LIMIT) {
      return {
        error: `Bucket limit reached (${BUCKETS_LIMIT})`,
        data: null,
      };
    }

    const Region =
      typeof s3Client.config.region === "string"
        ? s3Client.config.region
        : await s3Client.config.region();

    if (NODE_ENV === "development")
      return {
        data: { Bucket, Region },
      };

    await s3Client.send(
      new CreateBucketCommand({
        Bucket,
      }),
    );
    return { error: null, data: { Bucket, Region } };
  } catch (error: any) {
    console.error(error);
    return { error: error.message, data: null };
  }
}

export async function deleteBucket(_: any, Bucket: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized", data: null };
  }

  try {
    const objects = await s3Client.send(
      new ListObjectsV2Command({
        Bucket,
        MaxKeys: 1,
      }),
    );

    if (objects.KeyCount && objects.KeyCount > 0) {
      return {
        error:
          "Bucket is not empty. Delete all objects before deleting the bucket.",
        data: null,
      };
    }

    if (NODE_ENV !== "development") {
      await s3Client.send(new DeleteBucketCommand({ Bucket }));
    }

    return {
      error: null,
      data: { Bucket },
    };
  } catch (error: any) {
    console.error(error);

    if (error.name === "BucketNotEmpty") {
      return {
        error:
          "Bucket is not empty. Delete all objects before deleting the bucket.",
        data: null,
      };
    }

    if (error.name === "NoSuchBucket") {
      return {
        error: "Bucket does not exist.",
        data: null,
      };
    }

    return {
      error: "Failed to delete bucket.",
      data: null,
    };
  }
}
