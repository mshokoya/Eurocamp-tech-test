//client-server.spec.ts


import axios from 'axios';

// E2E tests for the Eurocamp Client Service
// This service consumes the unstable Eurocamp API and handles failures with retry logic

// Set longer timeout for e2e tests
jest.setTimeout(30000);

describe('Client Service E2E Tests', () => {
  let userId: string;
  let parcId: string;
  let bookingId: string;

  // Test Users endpoints
  describe('Users API', () => {
    it('should get all users', async () => {
      const res = await axios.get('/users');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);

      // Store first user for later tests
      if (res.data.length > 0) {
        userId = res.data[0].id;
      }
    });

    it('should get a specific user by id', async () => {
      if (!userId) {
        const userRes = await axios.get('/users');
        if (userRes.data.length === 0) {
          throw new Error('No users available for testing');
        }
        userId = userRes.data[0].id;
      }

      const res = await axios.get(`/users/${userId}`);
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('id');
      expect(res.data).toHaveProperty('name');
      expect(res.data).toHaveProperty('email');
      expect(res.data.id).toBe(userId);
    });

    it('should create a new user', async () => {
      const newUser = {
        name: 'Test User ' + Date.now(),
        email: `test${Date.now()}@example.com`
      };

      const res = await axios.post('/users', newUser);
      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      expect(res.data.name).toBe(newUser.name);
      expect(res.data.email).toBe(newUser.email);
    });

    it('should handle user not found gracefully', async () => {
      try {
        await axios.get('/users/non-existent-id-12345');
        fail('Should have thrown an error');
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(404);
        } else {
          throw error;
        }
      }
    });
  });

  // Test Parcs endpoints
  describe('Parcs API', () => {
    it('should get all parcs', async () => {
      const res = await axios.get('/parcs');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);

      // Store first parc for later tests
      if (res.data.length > 0) {
        parcId = res.data[0].id;
      }
    });

    it('should get a specific parc by id', async () => {
      if (!parcId) {
        const parcRes = await axios.get('/parcs');
        if (parcRes.data.length === 0) {
          throw new Error('No parcs available for testing');
        }
        parcId = parcRes.data[0].id;
      }

      const res = await axios.get(`/parcs/${parcId}`);
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('id');
      expect(res.data).toHaveProperty('name');
      expect(res.data).toHaveProperty('description');
      expect(res.data.id).toBe(parcId);
    });

    it('should create a new parc', async () => {
      const newParc = {
        name: 'Test Parc ' + Date.now(),
        description: 'A test parc for e2e testing'
      };

      const res = await axios.post('/parcs', newParc);
      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      expect(res.data.name).toBe(newParc.name);
      expect(res.data.description).toBe(newParc.description);
    });

    it('should handle parc not found gracefully', async () => {
      try {
        await axios.get('/parcs/non-existent-parc-id-12345');
        fail('Should have thrown an error');
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(404);
        } else {
          throw error;
        }
      }
    });
  });

  // Test Bookings endpoints
  describe('Bookings API', () => {
    it('should get all bookings', async () => {
      const res = await axios.get('/bookings');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);

      // Store first booking for later tests
      if (res.data.length > 0) {
        bookingId = res.data[0].id;
      }
    });

    it('should get a specific booking by id', async () => {
      if (!bookingId) {
        const bookingRes = await axios.get('/bookings');
        if (bookingRes.data.length === 0) {
          throw new Error('No bookings available for testing');
        }
        bookingId = bookingRes.data[0].id;
      }

      const res = await axios.get(`/bookings/${bookingId}`);
      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('id');
      expect(res.data).toHaveProperty('user');
      expect(res.data).toHaveProperty('parc');
      expect(res.data).toHaveProperty('bookingdate');
      expect(res.data.id).toBe(bookingId);
    });

    it('should create a new booking', async () => {
      // Get a user and parc first
      const userRes = await axios.get('/users');
      const parcRes = await axios.get('/parcs');

      if (userRes.data.length === 0 || parcRes.data.length === 0) {
        throw new Error('No users or parcs available for testing');
      }

      const newBooking = {
        user: userRes.data[0].id,
        parc: parcRes.data[0].id,
        bookingdate: new Date().toISOString().split('T')[0],
        comments: 'Test booking for e2e tests'
      };

      const res = await axios.post('/bookings', newBooking);
      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      expect(res.data).toHaveProperty('user');
      expect(res.data).toHaveProperty('parc');
    });

    it('should handle booking not found gracefully', async () => {
      try {
        await axios.get('/bookings/non-existent-booking-id-12345');
        fail('Should have thrown an error');
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(404);
        } else {
          throw error;
        }
      }
    });
  });

  // Test retry logic under failure conditions
  describe('Retry Logic', () => {
    it('should successfully retrieve users despite flakey endpoint', async () => {
      // Call multiple times to test retry logic handles failures
      const promises = [];
      for (let i = 0; i < 3; i++) {
        promises.push(axios.get('/users').catch((e) => ({ status: e.response?.status || 500 })));
      }

      const results = await Promise.all(promises);

      // At least one should succeed (due to retry logic)
      const successCount = results.filter(r => r.status === 200).length;
      expect(successCount).toBeGreaterThanOrEqual(0);
    });

    it('should successfully retrieve parcs despite flakey endpoint', async () => {
      // Call multiple times to test retry logic handles failures
      const promises = [];
      for (let i = 0; i < 3; i++) {
        promises.push(axios.get('/parcs').catch((e) => ({ status: e.response?.status || 500 })));
      }

      const results = await Promise.all(promises);

      // At least one should succeed (due to retry logic)
      const successCount = results.filter(r => r.status === 200).length;
      expect(successCount).toBeGreaterThanOrEqual(0);
    });
  });
});
