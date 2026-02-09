"use server";

import {
  CreateBucketCommand,
  DeleteBucketCommand,
  HeadBucketCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  NoSuchBucket,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { addProxyToClient } from "aws-sdk-v3-proxy";
import { auth } from "@/auth";
import { BUCKETS_LIMIT } from "@/lib/config";
import { getBucketName, getBucketPrefix } from "../bucket";

const { HTTPS_PROXY, NODE_ENV } = process.env;

const s3Client = HTTPS_PROXY
  ? addProxyToClient(new S3Client({}))
  : new S3Client({});

export async function getUserBucketByName(bucketName: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const Prefix = getBucketPrefix(session);
  if (!bucketName.startsWith(Prefix)) {
    console.log("Try access bucket user is not owner: ", Prefix, bucketName);
    return;
  }

  try {
    const bucket = await s3Client.send(
      new HeadBucketCommand({ Bucket: bucketName }),
    );
    return bucket;
  } catch (error: unknown) {
    if (error instanceof NoSuchBucket) return;

    console.error("Unhandled error getting bucket by name:", error);
  }
}

export async function getUserBuckets() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const Prefix = getBucketPrefix(session);

  try {
    const { Buckets } = await s3Client.send(new ListBucketsCommand({ Prefix }));
    return Buckets || [];
  } catch (error: unknown) {
    if (error instanceof S3ServiceException) {
      return;
    }
    console.error("Unhandled error getting bucket by user:", error);
    return;
  }
}

export async function createBucket(_: any, bucketName: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", data: null };

  const Bucket = getBucketName(session, bucketName);

  try {
    const userBuckets = await getUserBuckets();
    if (BUCKETS_LIMIT && (userBuckets?.length ?? 0) >= BUCKETS_LIMIT) {
      return { error: `Bucket limit reached (${BUCKETS_LIMIT})`, data: null };
    }

    if (NODE_ENV !== "development") {
      await s3Client.send(new CreateBucketCommand({ Bucket }));
    }
    return { error: null, data: { Bucket } };
  } catch (error: any) {
    console.error(`Error creating bucket ${bucketName}:`, error);
    if (error instanceof S3ServiceException) {
      return { error: `Could not create: ${error.name}`, data: null };
    }
    return {
      error: (error.message as string) || "An unexpected error occurred",
      data: null,
    };
  }
}

export async function deleteBucket(_: any, Bucket: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", data: null };

  const Prefix = getBucketPrefix(session);
  if (!Bucket.startsWith(Prefix)) return { error: "Unauthorized", data: null };

  try {
    const objects = await s3Client.send(
      new ListObjectsV2Command({ Bucket, MaxKeys: 1 }),
    );
    if (objects.KeyCount && objects.KeyCount > 0) {
      return {
        error: "Bucket is not empty. Delete objects first.",
        data: null,
      };
    }

    if (NODE_ENV !== "development") {
      await s3Client.send(new DeleteBucketCommand({ Bucket }));
    }
    return { error: null, data: { Bucket } };
  } catch (error: any) {
    if (error.name === "BucketNotEmpty") {
      return {
        error: "Bucket is not empty according to the storage service.",
        data: null,
      };
    }
    console.error(`Error deleting bucket ${Bucket}:`, error);
    if (error instanceof NoSuchBucket || error.name === "NoSuchBucket") {
      return { error: "This bucket no longer exists.", data: null };
    }
    if (error instanceof S3ServiceException) {
      return { error: `Delete failed: ${error.name}`, data: null };
    }

    return { error: "An internal error occurred during deletion", data: null };
  }
}
