import request from 'supertest';
import { buildApp } from '../../../backend/app';

const app = buildApp();

describe('Integration Tests', () => {
  it('should reset the balance of the given account', async () => {
    const response = await request(app)
      .post('/reset')
      .send({ account: 'account' });

    expect(response.status).toBe(204);
  });

  it('should charge the account if there is sufficient balance', async () => {
    const response = await request(app)
      .post('/charge')
      .send({ account: 'account', charges: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ isAuthorized: true, remainingBalance: 90, charges: 10 });
  });
});

