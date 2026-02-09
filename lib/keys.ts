import { StatusType } from "@aws-sdk/client-iam";

export const keyStatusVariant: Record<
  StatusType,
  "success" | "destructive" | "warning"
> = {
  Active: "success",
  Inactive: "destructive",
  Expired: "warning",
};