// @ts-check
import { test, expect } from '@playwright/test';

const apiBaseUrl = 'https://reqres.in/api';
const reqresApiKey = process.env.REQRES_API_KEY || 'reqres-free-v1';
const apiHeaders = {
  'x-api-key': reqresApiKey,
  Authorization: `Bearer ${reqresApiKey}`,
  'Content-Type': 'application/json',
};

let userId = '';
let createdName = '';
let createdJob = '';
let createResponseBody = null;

test.describe('Reqres API automation', () => {
  test.describe.configure({ mode: 'serial' });

  test('TC_API_01 - Create a user and validate response status code', async ({ request }) => {
    createdName = 'Yash';
    createdJob = 'QA Engineer';

    const createResponse = await request.post(`${apiBaseUrl}/users`, {
      headers: apiHeaders,
      data: {
        name: createdName,
        job: createdJob,
      },
    });

    expect(createResponse.status()).toBe(201);
    createResponseBody = await createResponse.json();

    expect(createResponseBody.name).toBe(createdName);
    expect(createResponseBody.job).toBe(createdJob);
    expect(createResponseBody.id).toBeTruthy();
  });

  test('TC_API_02 - Fetch and store userId after user creation', async () => {
    expect(createResponseBody).toBeTruthy();
    userId = String(createResponseBody.id);
    expect(userId).toBeTruthy();
  });

  test('TC_API_03 - Get created user details and validate', async ({ request }) => {
    expect(userId).toBeTruthy();

    const getResponse = await request.get(`${apiBaseUrl}/users/${userId}`, {
      headers: apiHeaders,
    });

    // Reqres free API does not always persist newly created users.
    if (getResponse.status() === 200) {
      const getBody = await getResponse.json();
      expect(String(getBody.data.id)).toBe(userId);
    } else {
      expect(getResponse.status()).toBe(404);
    }
  });

  test("TC_API_04 - Update user's name and validate the update", async ({ request }) => {
    expect(userId).toBeTruthy();
    const updatedName = 'Yash Updated';

    const updateResponse = await request.put(`${apiBaseUrl}/users/${userId}`, {
      headers: apiHeaders,
      data: {
        name: updatedName,
        job: createdJob,
      },
    });

    expect(updateResponse.status()).toBe(200);
    const updateBody = await updateResponse.json();

    expect(updateBody.name).toBe(updatedName);
    expect(updateBody.job).toBe(createdJob);
    expect(updateBody.updatedAt).toBeTruthy();
  });
});

//npm run test:api // to run api tests 
// npm run report:alt // to view api test report

// run below both commands to run all tests and view report in one go
// npm test
// npm run report:alt