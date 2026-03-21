// @ts-check
import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const username = 'Yash';
const password = 'Test@123';
const bookName = 'Learning JavaScript Design Patterns';
const homeUrl = 'https://demoqa.com/';
const booksUrl = 'https://demoqa.com/books';
const detailsUrl = 'https://demoqa.com/books?search=9781449331818';
const expectedAuthor = 'Addy Osmani';
const expectedPublisher = "O'Reilly Media";

test.describe.configure({ mode: 'serial' });

test.afterEach(async ({ page }, testInfo) => {
  const screenshotPath = testInfo.outputPath('final-state.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach('final-state-screenshot', {
    path: screenshotPath,
    contentType: 'image/png',
  });
});

async function openBookStorePage(page) {
  await page.goto(homeUrl, { waitUntil: 'domcontentloaded' });
  await page.setViewportSize({ width: 1440, height: 900 });
  const bookStoreCard = page.getByRole('heading', { name: 'Book Store Application' });
  await expect(bookStoreCard).toBeVisible();
  await bookStoreCard.scrollIntoViewIfNeeded();
  await bookStoreCard.click();
  await expect(page).toHaveURL(/\/books\/?$/);
  await expect(page.getByPlaceholder('Type to search')).toBeVisible();
}

async function loginToBookStore(page) {
  await openBookStorePage(page);
  const loginButton = page.getByRole('button', { name: 'Login' });
  await expect(loginButton).toBeVisible();
  await loginButton.click();
  await page.locator('#userName').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#login').click();
}

async function goToBookStoreMenu(page) {
  await page.getByRole('listitem').filter({ hasText: /^Book Store$/ }).click();
}

async function searchBook(page) {
  await goToBookStoreMenu(page);
  const searchInput = page.locator('#searchBox');
  await searchInput.click();
  await searchInput.fill(bookName);
}

async function goToBookDetailsUrl(page) {
  await page.goto(detailsUrl, { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/books\?search=9781449331818/);
}

test('TC_UI_01 - Navigate to DemoQA and open Book Store Application', async ({ page }) => {
  await openBookStorePage(page);
});

test('TC_UI_02 - Validate username and logout button after login', async ({ page }) => {
  await loginToBookStore(page);
  await expect(page.locator('#userName-value')).toHaveText(username);
  await expect(page.getByRole('button', { name: /^Log\s?out$/i })).toBeVisible();
});

test('TC_UI_03 - Click on Book Store button', async ({ page }) => {
  await loginToBookStore(page);
  await goToBookStoreMenu(page);
  await expect(page).toHaveURL(/\/books/);
  await expect(page.getByPlaceholder('Type to search')).toBeVisible();
});

test('TC_UI_04 - Search Learning JavaScript Design Patterns and open details page', async ({ page }) => {
  await loginToBookStore(page);
  await goToBookStoreMenu(page);
  const searchInput = page.locator('#searchBox');
  await searchInput.click();
  await searchInput.fill(bookName);
  await expect(searchInput).toHaveValue(bookName);
  await goToBookDetailsUrl(page);
  await expect(page.locator('#title-wrapper #userName-value')).toHaveText(bookName);
});

test('TC_UI_05 - Print Title, Author and Publisher into a file', async ({ page }) => {
  await loginToBookStore(page);
  await goToBookDetailsUrl(page);

  const title = (await page.locator('#title-wrapper #userName-value').innerText()).trim();
  const author = (await page.locator('#author-wrapper #userName-value').innerText()).trim();
  const publisher = (await page.locator('#publisher-wrapper #userName-value').innerText()).trim();
  await expect(title).toBe(bookName);
  await expect(author).toBe(expectedAuthor);
  await expect(publisher).toBe(expectedPublisher);

  const outputDir = path.resolve(process.cwd(), 'output');
  const outputFile = path.join(outputDir, 'book-details.txt');
  const output = `Title: ${title}\nAuthor: ${author}\nPublisher: ${publisher}\n`;

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, output, 'utf8');
});

test('TC_UI_06 - Click logout and verify user is logged out', async ({ page }) => {
  await loginToBookStore(page);
  await expect(page.locator('#userName-value')).toHaveText(username);
  const logoutButton = page.getByRole('button', { name: /^Log\s*out$/i });
  await expect(logoutButton).toBeVisible();
  await logoutButton.click();
  await expect(page).toHaveURL(/\/login\/?$/);
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});


//npm run test:headed -- --grep "TC_UI_06" // to run specific test case 
//npm run report:alt     // when port conflict happens so then use alternate port
