"use server";

import {
  IAMClient,
  CreateUserCommand,
  PutUserPolicyCommand,
  CreateAccessKeyCommand,
} from "@aws-sdk/client-iam";
import "dotenv/config";
import { addProxyToClient } from "aws-sdk-v3-proxy";
import { S3Client, CreateBucketCommand } from "@aws-sdk/client-s3";
import { auth } from "@/auth";

const iamClient = addProxyToClient(new IAMClient({}));
const s3Client = addProxyToClient(new S3Client({}));

// TODO: overwriteable from env
const prefix = `self-service-buckets`;

export async function getIamUser() {
  // TODO: implement
}

export async function createIamUser(prevState: any) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", data: null };
  const { preferredUsername } = session.user;

  try {
    throw new Error(`This action is disabled for the time being`);

    await iamClient.send(
      new CreateUserCommand({
        UserName: preferredUsername,
        Tags: [{ Key: "createdBy", Value: "self-service-buckets" }],
      }),
    );

    const policyDocument = {
      Version: "2012-10-17",
      Statement: [
        // Bucket-level permissions
        {
          Effect: "Allow",
          Action: ["s3:ListBucket"],
          Resource: `arn:aws:s3:::${prefix}-${preferredUsername}-*`,
        },

        // Object-level permissions
        {
          Effect: "Allow",
          Action: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
          Resource: `arn:aws:s3:::${prefix}-${preferredUsername}-*/*`,
        },
      ],
    };

    await iamClient.send(
      new PutUserPolicyCommand({
        UserName: preferredUsername,
        PolicyName: `${prefix}-${preferredUsername}`,
        PolicyDocument: JSON.stringify(policyDocument),
      }),
    );

    return { error: null, data: { UserName: preferredUsername } };
  } catch (error: any) {
    console.error(error);
    return { error: error.message, data: null };
  }
}

export async function getUserKeys() {
  // TODO: implement
}

export async function createKeys(prevState: any) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", data: null };
  const { preferredUsername } = session.user;

  return {
    error: null,
    data: {
      AccessKeyId: "dummy access key ID for testing",
      SecretAccessKey: "dummy secret key for testing",
    },
  };

  try {
    const { AccessKey } = await iamClient.send(
      new CreateAccessKeyCommand({
        UserName: preferredUsername,
      }),
    );
    return { error: null, data: AccessKey };
  } catch (error: any) {
    console.error(error);
    return { error: error.message, data: null };
  }
}

export async function getUserBuckets() {
  // TODO: implement
}

export async function createBucket(prevState: any, bucketName: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", data: null };

  const { preferredUsername } = session.user;

  const Bucket = `${prefix}-${preferredUsername}-${bucketName}`;

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
