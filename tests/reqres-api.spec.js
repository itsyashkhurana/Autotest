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

test.describe('Reqres API automation', () => {
  test.describe.configure({ mode: 'serial' });

  test('API_TC_01 - Create user and store userId', async ({ request }) => {
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
    const createBody = await createResponse.json();

    expect(createBody.name).toBe(createdName);
    expect(createBody.job).toBe(createdJob);
    expect(createBody.id).toBeTruthy();

    userId = String(createBody.id);
  });

  test('API_TC_02 - Get created user details and validate', async ({ request }) => {
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

  test('API_TC_03 - Update user name and validate', async ({ request }) => {
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