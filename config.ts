export const basePrefix = `self-service-buckets`;
export const BUCKETS_LIMIT = process.env.BUCKETS_LIMIT
  ? Number(process.env.BUCKETS_LIMIT)
  : undefined;
