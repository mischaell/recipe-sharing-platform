# Authentication Flow Tests

## Test Files

### `auth-flow.spec.ts`
Automated end-to-end test that:
- Simulates user signup
- Verifies signed-in state appears on homepage
- Verifies signed-in state appears on login page
- Tests sign-out functionality

**Note:** This test may fail if Supabase email confirmation is enabled. You can disable it in Supabase Dashboard → Authentication → Email Auth.

### `auth-flow-manual.spec.ts`
Manual verification test that:
- Assumes you're already signed in
- Verifies the header shows "Dashboard" and "Sign Out" on homepage
- Verifies the header shows "Dashboard" and "Sign Out" on login page (or redirects)

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/auth-flow.spec.ts

# Run with UI mode (interactive)
npm run test:ui

# Run manual verification test (after signing in manually)
npx playwright test tests/auth-flow-manual.spec.ts
```

## Test Requirements

1. Dev server must be running on `http://localhost:3000`
2. Supabase project must be configured with `.env.local`
3. For automated tests: Email confirmation should be disabled in Supabase (or tests need to be updated to handle email confirmation flow)




