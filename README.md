# DemoQA Playwright Assignment

This project contains an end-to-end Playwright test for the DemoQA Book Store flow.

## test cases link https://docs.google.com/spreadsheets/d/1Tco18AtsyJnjv-PTmQ70DQ85wqGVjJEPePU7C2Ulx08/edit?gid=623949909#gid=623949909

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

Open Playwright HTML report:

```bash
npm run report
```

If default report port is busy:

```bash
npm run report:alt
```

## Evidence in Report

Each test case is configured to capture:

- Screenshot: `on`
- Video: `on`
- Trace: `on-first-retry`

Run tests and open report:

```bash
npm run test:report
```

## API Test Setup (Reqres)

1. Copy `.env.example` to `.env`
2. Put your Reqres API key in `REQRES_API_KEY`

Example:

```bash
cp .env.example .env
```

Run API tests:

```bash
npm run test:api
```

## Assignment Flow Implemented

The test cases in `tests/bookstore.spec.js` perform:

1. Open `https://demoqa.com/`
2. Navigate to **Book Store Application**
3. Click **Login** and sign in with:
   - Username: `Yash`
   - Password: `Test@123`
4. Validate logged-in username and logout button
5. Click **Book Store** menu
6. Click search field and search `Learning JavaScript Design Patterns`
7. Validate the search result contains the book
8. Open `https://demoqa.com/books?search=9781449331818`
9. Validate details:
   - Title: `Learning JavaScript Design Patterns`
   - Author: `Addy Osmani`
   - Publisher: `O'Reilly Media`
10. Write Title, Author, and Publisher to:
   - `output/book-details.txt`
11. Click **Log out** and validate redirect to `https://demoqa.com/login`
