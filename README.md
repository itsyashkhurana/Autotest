# DemoQA Playwright Assignment

This project contains an end-to-end Playwright test for the DemoQA Book Store flow.

## Prerequisites

- Node.js 18+ (recommended)
- npm

## Setup

```bash
npm install
npx playwright install chromium
```

## Run Test

```bash
npm test
```

Or run headed mode:

```bash
npm run test:headed
```

## Assignment Flow Implemented

The test cases in `tests/bookstore.spec.js` perform:

1. Open `https://demoqa.com/books`
2. Click **Login** and sign in with:
   - Username: `Yash`
   - Password: `Test@123`
3. Validate logged-in username and logout button
4. Click **Book Store** menu
5. Click search field and search `Learning JavaScript Design Patterns`
6. Validate the search result contains the book
7. Open `https://demoqa.com/books?search=9781449331818`
8. Validate details:
   - Title: `Learning JavaScript Design Patterns`
   - Author: `Addy Osmani`
   - Publisher: `O'Reilly Media`
9. Write Title, Author, and Publisher to:
   - `output/book-details.txt`
10. Click **Log out**
