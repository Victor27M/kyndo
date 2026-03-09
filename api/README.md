# API Consolidation

## Problem
Vercel Hobby plan limits deployments to 12 serverless functions. Previously, each API endpoint file created a separate function.

## Solution
Consolidated all API endpoints into a single serverless function (`api/index.ts`) with internal routing.

### Before (4 functions):
- `api/checkout.ts` → `/api/checkout`
- `api/waitlist.ts` → `/api/waitlist`
- `api/custom-request.ts` → `/api/custom-request`
- `api/stripe-webhook.ts` → `/api/stripe-webhook`

### After (1 function):
- `api/index.ts` → routes all `/api/*` requests internally

### Architecture
```
Client Request
    ↓
/api/checkout
    ↓
Vercel Rewrite (vercel.json)
    ↓
/api/index
    ↓
Router (checks pathname)
    ↓
CheckoutController
```

### Old Files
Moved to `api/_old/` for reference. These are not deployed (excluded via `.vercelignore`).

### Important Notes
- The unified handler disables body parsing globally to support Stripe webhooks (which need raw request bodies for signature verification)
- All existing frontend API calls remain unchanged
- Controllers, services, and repositories are unmodified
