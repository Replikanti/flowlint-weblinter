import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/FlowLint/);
});

test('loads the main app component', async ({ page }) => {
  await page.goto('/');

  // Check if the main landing page elements are present
  // For example, looking for "FlowLint" or "n8n"
  const content = await page.textContent('body');
  expect(content).toContain('FlowLint');
});
