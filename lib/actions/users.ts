"use server";
import "dotenv/config";
import {
  CreateAccessKeyCommand,
  CreateUserCommand,
  GetUserCommand,
  ListAccessKeysCommand,
  PutUserPolicyCommand,
} from "@aws-sdk/client-iam";
import { auth } from "@/auth";
import { basePrefix } from "@/lib/config";
import { addProxyToClient } from "aws-sdk-v3-proxy";
import { S3Client } from "@aws-sdk/client-s3";

import { IAMClient } from "@aws-sdk/client-iam";

const { HTTPS_PROXY } = process.env;

const iamClient = HTTPS_PROXY
  ? addProxyToClient(new IAMClient({}))
  : new IAMClient({});

export async function getIamUser() {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", data: null };
  const { preferredUsername: UserName } = session.user;

  try {
    const command = new GetUserCommand({ UserName });
    const { User } = await iamClient.send(command);
    return User;
  } catch (err) {
    if (err instanceof Error && err.name !== "NoSuchEntityException") {
      console.error("Error retrieving user:", err);
    }
    return undefined;
  }
}

export async function createIamUser(prevState: any) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", data: null };
  const { preferredUsername } = session.user;

  try {
    // throw new Error(`This action is disabled for the time being`);

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
          Resource: `arn:aws:s3:::${basePrefix}-${preferredUsername}-*`,
        },

        // Object-level permissions
        {
          Effect: "Allow",
          Action: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
          Resource: `arn:aws:s3:::${basePrefix}-${preferredUsername}-*/*`,
        },
      ],
    };

    await iamClient.send(
      new PutUserPolicyCommand({
        UserName: preferredUsername,
        PolicyName: `${basePrefix}-${preferredUsername}`,
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
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const { preferredUsername: UserName } = session.user;

  try {
    const { AccessKeyMetadata } = await iamClient.send(
      new ListAccessKeysCommand({ UserName }),
    );

    return AccessKeyMetadata;
  } catch (err) {
    console.error("Error listing access keys:", err);
  }
}

export async function createKeys(prevState: any) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", data: null };
  const { preferredUsername } = session.user;

  // return {
  //   error: null,
  //   data: {
  //     AccessKeyId: "dummy access key ID for testing",
  //     SecretAccessKey: "dummy secret key for testing",
  //   },
  // };

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
