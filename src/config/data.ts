import { TestData } from '../types';

export const testData: TestData = {
  users: {
    valid: {
      username: process.env.TEST_USERNAME || 'Username_02',
      password: process.env.TEST_PASSWORD || '123456789',
      email: 'testuser123@example.com',
      firstName: 'Test',
      lastName: 'User',
    },
    invalid: {
      username: 'invaliduser',
      password: 'wrongpassword',
    },
  },
  products: {
    laptop: 'Sony vaio i5',
    phone: 'Samsung galaxy s6',
    monitor: 'Apple monitor 24',
  },
  categories: ['Phones', 'Laptops', 'Monitors'],
};
