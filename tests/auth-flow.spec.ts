import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  // Generate unique email for each test run
  const timestamp = Date.now();
  const testEmail = `test-${timestamp}@example.com`;
  const testPassword = 'testpassword123';
  const testFullName = 'Test User';
  const testUserName = `testuser${timestamp}`;

  test('should sign up and show signed-in state on homepage and login page', async ({ page }) => {
    // Step 1: Navigate to signup page
    await page.goto('/signup');
    await expect(page.locator('h2')).toContainText('Create your account');

    // Step 2: Fill out signup form
    await page.fill('input[name="fullName"]', testFullName);
    await page.fill('input[name="userName"]', testUserName);
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);

    // Step 3: Submit signup form
    await page.click('button[type="submit"]');

    // Step 4: Wait for redirect to homepage after signup or check for errors
    // Note: If email confirmation is required, user might stay on signup page
    try {
      await page.waitForURL('/', { timeout: 10000 });
    } catch (e) {
      // If still on signup page, check if there's an error message
      const errorMessage = await page.locator('text=/error|Error|invalid|Invalid/').first().textContent().catch(() => null);
      if (errorMessage) {
        console.log('Signup error:', errorMessage);
      }
      // Try to navigate to homepage manually to test the auth state
      await page.goto('/');
    }

    // Step 5: Verify signed-in state on homepage
    // Should see "Dashboard" and "Sign Out" instead of "Sign In" and "Sign Up"
    await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Sign Out')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Sign In')).not.toBeVisible();
    await expect(page.locator('text=Sign Up')).not.toBeVisible();

    // Step 6: Navigate to login page
    await page.goto('/login');

    // Step 7: Verify signed-in state on login page
    // When signed in, should be redirected away from login page OR see signed-in header
    // Check if we're still on login page or redirected
    const currentUrl = page.url();
    
    if (currentUrl.includes('/login')) {
      // If still on login page, verify signed-in header is shown
      await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=Sign Out')).toBeVisible({ timeout: 5000 });
    } else {
      // If redirected (which is expected when signed in), verify we're on homepage with signed-in state
      await expect(page).toHaveURL('/');
      await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=Sign Out')).toBeVisible({ timeout: 5000 });
    }

    // Step 8: Verify homepage shows signed-in state
    await page.goto('/');
    await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Sign Out')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Sign In')).not.toBeVisible();
    await expect(page.locator('text=Sign Up')).not.toBeVisible();
  });

  test('should sign out and show signed-out state', async ({ page }) => {
    // First sign in (or use the user from previous test)
    await page.goto('/signup');
    const timestamp2 = Date.now();
    const testEmail2 = `test-${timestamp2}@example.com`;
    
    await page.fill('input[name="fullName"]', 'Test User 2');
    await page.fill('input[name="userName"]', `testuser${timestamp2}`);
    await page.fill('input[name="email"]', testEmail2);
    await page.fill('input[name="password"]', 'testpassword123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect or navigate manually
    try {
      await page.waitForURL('/', { timeout: 10000 });
    } catch (e) {
      await page.goto('/');
    }

    // Verify signed in
    await expect(page.locator('text=Dashboard')).toBeVisible({ timeout: 5000 });

    // Sign out
    await page.click('button:has-text("Sign Out")');
    await page.waitForURL('/', { timeout: 5000 });

    // Verify signed out state
    await expect(page.locator('text=Sign In')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Sign Up')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Dashboard')).not.toBeVisible();
    await expect(page.locator('text=Sign Out')).not.toBeVisible();
  });
});

