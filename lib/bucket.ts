import { Session } from "next-auth";
import { basePrefix } from "./config";

/**
 * Builds the standardized S3 bucket prefix for the current user.
 *
 * Format:
 *   <basePrefix>-<preferredUsername>-
 *
 * Example:
 *   self-service-buckets-john-
 *
 * @param session - Authenticated NextAuth session containing user info
 * @returns The bucket name prefix for the authenticated user
 */
export function getBucketPrefix(session: Session): string {
  return `${basePrefix}-${session.user.preferredUsername}-`;
}

/**
 * Builds the full S3 bucket name for a user-owned bucket.
 *
 * Format:
 *   <basePrefix>-<preferredUsername>-<bucketName>
 *
 * Example:
 *   self-service-buckets-john-photos
 *
 * @param session - Authenticated NextAuth session containing user info
 * @param bucketName - User-provided bucket identifier (validated separately)
 * @returns The full S3 bucket name
 */
export function getBucketName(session: Session, bucketName: string): string {
  return getBucketPrefix(session) + bucketName;
}
