"use server";

import "dotenv/config";
import {
  CreateAccessKeyCommand,
  CreateUserCommand,
  GetUserCommand,
  GetAccessKeyLastUsedCommand,
  PutUserPolicyCommand,
  ListAccessKeysCommand,
  NoSuchEntityException,
  IAMServiceException,
  EntityAlreadyExistsException,
  DeleteAccessKeyCommand,
} from "@aws-sdk/client-iam";
import { auth } from "@/auth";
import { basePrefix } from "@/lib/config";
import { addProxyToClient } from "aws-sdk-v3-proxy";

import { IAMClient } from "@aws-sdk/client-iam";
import { S3ServiceException } from "@aws-sdk/client-s3";

const { HTTPS_PROXY, NODE_ENV } = process.env;

const iamClient = HTTPS_PROXY
  ? addProxyToClient(new IAMClient({}))
  : new IAMClient({});

export async function getIamUser() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const { preferredUsername: UserName } = session.user;

  try {
    const command = new GetUserCommand({ UserName });
    const { User } = await iamClient.send(command);
    return User;
  } catch (err) {
    if (err instanceof Error && err.name !== "NoSuchEntityException") {
      console.error("Error retrieving user:", err);
    }
    return;
  }
}

export async function createIamUser() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
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
          Action: [
            "s3:ListBucket",
            "s3:GetBucketLocation",
            "s3:ListBucketMultipartUploads",
          ],
          Resource: `arn:aws:s3:::${basePrefix}-${preferredUsername}-*`,
        },

        // Object-level permissions
        {
          Effect: "Allow",
          Action: [
            "s3:GetObject",
            "s3:PutObject",
            "s3:DeleteObject",
            "s3:DeleteObjects",
            "s3:GetObjectAttributes",
            "s3:ListMultipartUploadParts",
            "s3:AbortMultipartUpload",
          ],
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
    if (error instanceof EntityAlreadyExistsException) {
      return { error: "User already exists", data: null };
    }
    console.error("IAM Create User Error:", error);
    return {
      error: (error.message as string) || "Could not create IAM user",
      data: null,
    };
  }
}

export async function getUserKeyById(AccessKeyId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  const { preferredUsername: UserName } = session.user;

  try {
    const { AccessKeyMetadata } = await iamClient.send(
      new ListAccessKeysCommand({ UserName }),
    );

    const keyMeta = AccessKeyMetadata?.find(
      (k) => k.AccessKeyId === AccessKeyId,
    );

    if (!keyMeta) {
      return;
    }

    return keyMeta;
  } catch (error: unknown) {
    if (error instanceof NoSuchEntityException) return;

    if (error instanceof IAMServiceException) {
      console.error("IAM Service Error:", error);
      return;
    }

    console.error("Unexpected Error getting user key:", error);
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

export async function createKeys(_: any) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  if (NODE_ENV === "development")
    return {
      data: {
        AccessKeyId: "Dummy AccessKeyId",
        SecretAccessKey: "Dummy SecretAccessKey",
      },
    };

  const { preferredUsername } = session.user;

  try {
    const { AccessKey } = await iamClient.send(
      new CreateAccessKeyCommand({
        UserName: preferredUsername,
      }),
    );
    return { error: null, data: AccessKey };
  } catch (error: any) {
    console.error("Create Keys Error:", error);
    
    return { error: error.message || "Failed to create keys", data: null };
  }
}

export async function deleteUserAccessKey(_: any, AccessKeyId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  if (NODE_ENV === "development") {
    return { error: null, data: true };
  }

  const { preferredUsername } = session.user;

  try {
    const { UserName } = await iamClient.send(
      new GetAccessKeyLastUsedCommand({
        AccessKeyId,
      }),
    );

    if (UserName !== preferredUsername) {
      return { error: "Unauthorized", data: null };
    }

    await iamClient.send(
      new DeleteAccessKeyCommand({
        UserName,
        AccessKeyId,
      }),
    );

    return { error: null, data: true };
  } catch (error: unknown) {
    console.error("Error deleting key:", error);
    if (error instanceof NoSuchEntityException) {
      return { error: "Access key not found.", data: null };
    }

    if (error instanceof IAMServiceException) {
      console.error("IAM Delete Key Error:", error);
      return {
        error: `IAM Error: ${error.name}`,
        data: null,
      };
    }

    return { error: "Failed to delete access key.", data: null };
  }
}
