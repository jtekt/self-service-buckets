# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Next.js (App Router) app that lets authenticated users self-provision their own AWS S3 bucket(s) and IAM access keys, scoped so each user can only see/manage resources with their own prefix. Deployed to Kubernetes (EKS) via GitLab CI, behind Keycloak SSO.

## Commands

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build (standalone output)
npm run start    # run production build
npm run lint      # eslint (flat config, eslint-config-next)
```

There is no test suite/framework configured in this repo (`test.bash` is an unrelated scratch script, not a test runner).

## Architecture

### Authentication & authorization layering

Auth is via **Auth.js v5 / next-auth beta** (`auth.ts`) using a single Keycloak provider. The Keycloak `preferred_username` claim is threaded through the JWT/session callbacks and exposed as `session.user.preferredUsername` — this is the identity used everywhere for scoping AWS resources (not email or sub).

Route protection is layered through **nested route groups**, each with its own `layout.tsx` gate:

- `app/(unauthenticated)/` — login page, no session required.
- `app/(authenticated)/layout.tsx` — requires a NextAuth session; redirects to `/login` if absent.
  - `app/(authenticated)/(noNeedForIamAccount)/` — for users who do **not** yet have an IAM user (e.g. `accounts/new`); redirects to `/` if they already have one.
  - `app/(authenticated)/(needsIamAccount)/` — buckets/keys pages; redirects to `/accounts/new` if the user has no IAM user yet.

Because these are parallel route groups (not nested paths), a request that doesn't match either inner group's pages won't get gated by them — new pages must be placed under the correct group to inherit the right redirect behavior. IAM-user presence is checked via `getIamUser()` (`lib/actions/users.ts`) on every request in that group — there is no caching.

`proxy.ts` re-exports `auth` as `proxy`, wiring Auth.js into Next's middleware/proxy layer for session handling at the edge.

### AWS resource naming & scoping

Every S3 bucket and IAM policy is namespaced per user under `basePrefix` (`lib/config.ts`, currently `self-service-buckets`):

- Bucket names: `<basePrefix>-<preferredUsername>-<userChosenName>` (see `lib/bucket.ts`: `getBucketPrefix` / `getBucketName`).
- IAM policy resource ARNs are scoped to `arn:aws:s3:::<basePrefix>-<preferredUsername>-*`.

All server-side bucket/key access checks a resource's prefix against the current user's prefix before acting — this is the actual authorization boundary (not just the route layout redirects), since layouts only gate page rendering. When adding new bucket/key operations, always re-derive and check the prefix rather than trusting a client-supplied bucket/key name.

### Server actions as the API layer

There are no API routes for business logic (only `app/api/auth/[...nextauth]/route.ts` for NextAuth itself). All AWS operations are `"use server"` functions in `lib/actions/buckets.ts` (S3) and `lib/actions/users.ts` (IAM), called directly from client components via `useActionState`/`startTransition`. Each action:

1. Re-authenticates via `await auth()` and bails with `Unauthorized` if there's no session (do this in every new action, not just in the calling page/layout).
2. Returns a `{ error, data }` shape rather than throwing, so client components can render `state.error` inline.
3. Branches on `NODE_ENV === "development"` to skip real AWS mutations (create/delete bucket, create/delete key) — dev mode returns fake/dummy success data instead of touching AWS. Keep this pattern when adding new mutating actions.

AWS SDK v3 clients (`S3Client`, `IAMClient`) are module-level singletons, wrapped with `addProxyToClient` from `aws-sdk-v3-proxy` when `HTTPS_PROXY` is set — needed because the deployment environment routes AWS calls through an outbound HTTP proxy.

### Config knobs

- `BUCKETS_LIMIT` env var (`lib/config.ts`) caps how many buckets a user may create; unset means unlimited. Enforced in `createBucket`.

### UI stack

shadcn/ui (`components.json`, style `radix-vega`, base color `neutral`) generates the primitives in `components/ui/`. Forms use `react-hook-form` + `zod` resolvers; a common client-component pattern (see `buckets/new/page.tsx`, `delete-bucket-btn.tsx`) is:

```
useActionState(serverAction, null) -> [state, action, pending]
startTransition(() => action(formValue))
useEffect on state.data -> toast.success + router.push
render state.error inline (Alert / destructive text) when present
```

Follow this pattern for new mutating UI rather than ad hoc `fetch`/`onSubmit` handling.

## Deployment

- `Dockerfile` builds via Next's `output: "standalone"` (see `next.config.ts`) multi-stage image.
- `.gitlab-ci.yml` builds/pushes to ECR and applies `kubernetes_manifest.yml` to an EKS namespace `self-service-suite` on pushes to `main`. Secrets are injected from a CI-managed env file into a Kubernetes secret (`self-service-buckets-env`) at deploy time — non-secret config (Keycloak issuer, region, `BUCKETS_LIMIT`) lives directly in `kubernetes_manifest.yml`.
