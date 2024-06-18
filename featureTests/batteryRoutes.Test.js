const request = require('supertest');
const app = require('../api/server');  // Adjust the path as needed

describe('GET /api/batteries', () => {
  it('should fetch all batteries', async () => {
    const res = await request(app).get('/api/batteries');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('length');
  });
});
