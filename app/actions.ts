"use server";

export async function createIamUser(prevState: any) {
  // 1: Create IAMs

  // 2. Attach policy
  // Policy name: `self-service-buckets-${username}

  return null;
}

export async function createKeys(prevState: any) {
  return null;
}

export async function createBucket(prevState: any, name: string) {
  // Bucket name: `self-service-buckets-${username}-${name}
  return null;
}
