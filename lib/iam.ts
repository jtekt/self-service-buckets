import "dotenv/config";
import { IAMClient } from "@aws-sdk/client-iam";
import { addProxyToClient } from "aws-sdk-v3-proxy";

const { HTTPS_PROXY } = process.env;

export const iamClient = HTTPS_PROXY
  ? addProxyToClient(new IAMClient({}))
  : new IAMClient({});
