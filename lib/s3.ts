import "dotenv/config";
import { addProxyToClient } from "aws-sdk-v3-proxy";
import { S3Client } from "@aws-sdk/client-s3";

const { HTTPS_PROXY } = process.env;

export const s3Client = HTTPS_PROXY
  ? addProxyToClient(new S3Client({}))
  : new S3Client({});
