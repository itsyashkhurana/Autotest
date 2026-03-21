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

async function attachEvidence(testInfo, name, payload) {
  await testInfo.attach(name, {
    body: JSON.stringify(payload, null, 2),
    contentType: 'application/json',
  });
}

test.describe('Reqres API automation', () => {
  test.describe.configure({ mode: 'serial' });

  test('TC_API_01 - Create a user and validate response status code', async ({ request }, testInfo) => {
    createdName = 'Yash';
    createdJob = 'QA Engineer';
    const createRequestBody = {
      name: createdName,
      job: createdJob,
    };

    const createResponse = await request.post(`${apiBaseUrl}/users`, {
      headers: apiHeaders,
      data: createRequestBody,
    });

    const createStatus = createResponse.status();
    createResponseBody = await createResponse.json();
    await attachEvidence(testInfo, 'api-evidence-create-user', {
      request: {
        method: 'POST',
        url: `${apiBaseUrl}/users`,
        headers: apiHeaders,
        body: createRequestBody,
      },
      response: {
        status: createStatus,
        body: createResponseBody,
      },
    });

    expect(createStatus).toBe(201);

    expect(createResponseBody.name).toBe(createdName);
    expect(createResponseBody.job).toBe(createdJob);
    expect(createResponseBody.id).toBeTruthy();
  });

  test('TC_API_02 - Fetch and store userId after user creation', async ({}, testInfo) => {
    expect(createResponseBody).toBeTruthy();
    userId = String(createResponseBody.id);
    expect(userId).toBeTruthy();
    await attachEvidence(testInfo, 'api-evidence-store-userid', {
      storedUserId: userId,
      sourceCreateResponse: createResponseBody,
    });
  });

  test('TC_API_03 - Get created user details and validate', async ({ request }, testInfo) => {
    expect(userId).toBeTruthy();

    const getResponse = await request.get(`${apiBaseUrl}/users/${userId}`, {
      headers: apiHeaders,
    });
    const getStatus = getResponse.status();
    const getBody = await getResponse.json();
    await attachEvidence(testInfo, 'api-evidence-get-user', {
      request: {
        method: 'GET',
        url: `${apiBaseUrl}/users/${userId}`,
        headers: apiHeaders,
      },
      response: {
        status: getStatus,
        body: getBody,
      },
    });

    // Reqres free API does not always persist newly created users.
    if (getStatus === 200) {
      expect(String(getBody.data.id)).toBe(userId);
    } else {
      expect(getStatus).toBe(404);
    }
  });

  test("TC_API_04 - Update user's name and validate the update", async ({ request }, testInfo) => {
    expect(userId).toBeTruthy();
    const updatedName = 'Yash Updated';
    const updateRequestBody = {
      name: updatedName,
      job: createdJob,
    };

    const updateResponse = await request.put(`${apiBaseUrl}/users/${userId}`, {
      headers: apiHeaders,
      data: updateRequestBody,
    });

    const updateStatus = updateResponse.status();
    const updateBody = await updateResponse.json();
    await attachEvidence(testInfo, 'api-evidence-update-user', {
      request: {
        method: 'PUT',
        url: `${apiBaseUrl}/users/${userId}`,
        headers: apiHeaders,
        body: updateRequestBody,
      },
      response: {
        status: updateStatus,
        body: updateBody,
      },
    });

    expect(updateStatus).toBe(200);

    expect(updateBody.name).toBe(updatedName);
    expect(updateBody.job).toBe(createdJob);
    expect(updateBody.updatedAt).toBeTruthy();
  });
});


//npm run test:all:headed    //1st
// npm run report:alt         //2nd
//npm run test:api // to run api tests 
//  to view api test report
// npm run test:api:report -- now add evidence in report  
// download report
// npm run test:all:headed && cd "/Users/yashkhurana/Autotest/Autotest" && zip -r "/Users/yashkhurana/Downloads/playwright-report.zip" "playwright-report"