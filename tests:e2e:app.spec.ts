import { test, expect } from '@playwright/test';

test('home hero renders', async ({ page }) => {
  await page.goto('/ja');
  await expect(page.getByRole('heading', { name: /ECeta/ })).toBeVisible();
});

test('language switch updates metadata', async ({ page }) => {
  await page.goto('/ja');
  await page.getByText('EN').click();
  await expect(page).toHaveURL(/\/en\//);
});

test('brand form validates', async ({ page }) => {
  await page.goto('/ja/for-brands');
  await page.getByRole('button', { name: '送信' }).click();
  await expect(page.getByText('必須項目です').first()).toBeVisible();
});