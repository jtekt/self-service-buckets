# Self-service buckets

A small Next.js app that lets authenticated users provision their own AWS S3 bucket(s) and IAM access keys, without needing AWS console/IAM access themselves.

Users sign in via Keycloak SSO. On first use they create a personal IAM user, which is granted an inline policy scoped to only their own buckets (named `self-service-buckets-<username>-*`). From there they can create/delete buckets and issue/revoke access keys to use with their own S3 tooling.

## Features

- SSO login via Keycloak (Auth.js / next-auth v5)
- Self-service IAM user creation with a least-privilege policy scoped to the user's own bucket prefix
- Create and delete S3 buckets (buckets must be empty before deletion)
- Issue and revoke IAM access keys
- Optional per-user bucket limit (`BUCKETS_LIMIT`)

## Tech stack

- Next.js 16 (App Router, Server Actions), React 19
- Auth.js / next-auth v5 with Keycloak
- AWS SDK v3 (`@aws-sdk/client-s3`, `@aws-sdk/client-iam`)
- shadcn/ui, Tailwind CSS v4
- react-hook-form + zod

## Getting started

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000. In development (`NODE_ENV=development`), bucket/key creation and deletion return mocked data instead of calling AWS, so you can exercise the flows without real credentials.

### Environment variables

| Variable | Description |
| --- | --- |
| `AUTH_KEYCLOAK_ID` | Keycloak client ID |
| `AUTH_KEYCLOAK_SECRET` | Keycloak client secret |
| `AUTH_KEYCLOAK_ISSUER` | Keycloak realm issuer URL |
| `AUTH_SECRET` | Secret used by Auth.js to sign session tokens |
| `NEXTAUTH_URL` | Public URL of this app (used for OAuth callbacks) |
| `AWS_REGION` | AWS region for S3/IAM calls |
| AWS credentials | Standard AWS SDK credential resolution (env vars, instance role, etc.) — not read directly by this app |
| `HTTPS_PROXY` | If set, routes AWS SDK calls through this proxy |
| `S3_ENDPOINT` | Display-only; shown to users as the endpoint to use with their access keys (defaults to `https://s3.amazonaws.com`) |
| `BUCKETS_LIMIT` | Optional max number of buckets per user (unset = unlimited) |

## Building & running

```bash
npm run build
npm run start
```

## Linting

```bash
npm run lint
```

## Deployment

Built as a standalone Next.js Docker image (see `Dockerfile`) and deployed to Kubernetes via GitLab CI (`.gitlab-ci.yml`, `kubernetes_manifest.yml`) on pushes to `main`.

## Development references

- Authentication: https://authjs.dev
- Server functions: https://nextjs.org/docs/app/getting-started/error-handling#server-functions
