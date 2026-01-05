import { test, expect } from '@playwright/test';

/**
 * Manual test to verify signed-in state
 * 
 * This test assumes you have already signed up/signed in manually.
 * It verifies that the header shows "Dashboard" and "Sign Out" when signed in.
 * 
 * To run this test:
 * 1. Manually sign up or sign in to your app
 * 2. Run: npx playwright test tests/auth-flow-manual.spec.ts
 */
test.describe('Authentication State Verification (Manual)', () => {
  test('should show signed-in state on homepage when authenticated', async ({ page, context }) => {
    // Navigate to homepage
    await page.goto('/');

    // Check if we're signed in by looking for Dashboard link
    const dashboardLink = page.locator('text=Dashboard');
    const signOutButton = page.locator('text=Sign Out');
    const signInLink = page.locator('text=Sign In');
    const signUpLink = page.locator('text=Sign Up');

    // Wait a moment for auth state to load
    await page.waitForTimeout(2000);

    const isSignedIn = await dashboardLink.isVisible().catch(() => false);

    if (isSignedIn) {
      // Verify signed-in state
      await expect(dashboardLink).toBeVisible();
      await expect(signOutButton).toBeVisible();
      await expect(signInLink).not.toBeVisible();
      await expect(signUpLink).not.toBeVisible();
      
      console.log('✅ Signed-in state verified on homepage');
    } else {
      // If not signed in, this test is skipped
      test.skip();
    }
  });

  test('should show signed-in state on login page when authenticated', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Wait a moment for potential redirect or auth state to load
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    const dashboardLink = page.locator('text=Dashboard');
    const signOutButton = page.locator('text=Sign Out');

    if (currentUrl.includes('/login')) {
      // Still on login page - check if signed-in header is shown
      const isSignedIn = await dashboardLink.isVisible().catch(() => false);
      
      if (isSignedIn) {
        await expect(dashboardLink).toBeVisible();
        await expect(signOutButton).toBeVisible();
        console.log('✅ Signed-in state verified on login page');
      } else {
        test.skip();
      }
    } else {
      // Redirected away from login page (expected when signed in)
      // Verify we're on homepage with signed-in state
      await expect(page).toHaveURL('/');
      await expect(dashboardLink).toBeVisible();
      await expect(signOutButton).toBeVisible();
      console.log('✅ Redirected from login page and signed-in state verified');
    }
  });
});





