import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => {
  // Enable API mocking before tests.
  server.listen();
});

afterEach(() => {
  // Reset any runtime request handlers we may add during the tests.
  server.resetHandlers();
});

afterAll(() => {
  // Clean up after the tests are finished.
  server.close();
});

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
}); 