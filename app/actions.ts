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

const iamClient = addProxyToClient(new IAMClient({}));
const s3Client = addProxyToClient(new S3Client({}));

const prefix = `self-service-buckets`;

// TODO: username from auth
const UserName = `ssb-testuser`;

export async function dummyAction(prevState: any) {
  return { banana: "test" };
}

export async function createIamUser(prevState: any) {
  // TODO: username from auth

  await iamClient.send(
    new CreateUserCommand({
      UserName,
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
        Resource: `arn:aws:s3:::${prefix}-${UserName}-*`,
      },

      // Object-level permissions
      {
        Effect: "Allow",
        Action: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
        Resource: `arn:aws:s3:::${prefix}-${UserName}-*/*`,
      },
    ],
  };

  await iamClient.send(
    new PutUserPolicyCommand({
      UserName,
      PolicyName: `${prefix}-${UserName}`,
      PolicyDocument: JSON.stringify(policyDocument),
    }),
  );

  return { error: null, data: { UserName } };
}

export async function createKeys(prevState: any) {
  // TODO: get username from auth
  const { AccessKey } = await iamClient.send(
    new CreateAccessKeyCommand({
      UserName,
    }),
  );

  return { error: null, data: AccessKey };
}

export async function createBucket(prevState: any, name: string) {
  // TODO: get username from auth

  const Bucket = `self-service-buckets-${UserName}-${name}`;
  await s3Client.send(
    new CreateBucketCommand({
      Bucket,
    }),
  );

  return { error: null, data: { Bucket } };
}
