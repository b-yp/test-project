import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.amazon.com/');
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await page.getByLabel('Email or mobile phone number').click();
  await page.getByLabel('Email or mobile phone number').fill('byapeng@qq.com');
  await page.getByLabel('Continue').click();
  await page.getByLabel('Password').fill('test123456');
  await page.getByLabel('Sign in').click();
  await page.getByPlaceholder('Search Amazon').fill('macbook pro');
  await page.getByPlaceholder('Search Amazon').press('Enter');
  await page.goto('https://www.amazon.com/s?k=macbook+pro&crid=TLK2DR87EB57&sprefix=macbook+pro%2Caps%2C491&ref=nb_sb_noss_1');
  await page.getByRole('link', { name: 'Apple 2023 MacBook Pro Laptop M3 Pro chip with 11‑core CPU, 14‑core GPU: 14.2-inch Liquid Retina XDR Display, 18GB Unified...', exact: true }).click();
  await page.locator('#add-to-cart-button').click();
  await page.getByLabel('items in cart').click();
  await page.getByRole('link', { name: 'Sign Out', exact: true }).click();
});