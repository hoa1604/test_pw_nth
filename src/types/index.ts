export interface TestConfig {
  baseUrl: string;
  apiBaseUrl: string;
  timeout: {
    test: number;
    expect: number;
    navigation: number;
    action: number;
  };
  browser: {
    headless: boolean;
    slowMo: number;
    viewport: {
      width: number;
      height: number;
    };
  };
  parallel: {
    workers: number;
    retries: number;
  };
}

export interface UserCredentials {
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface TestData {
  users: {
    valid: UserCredentials;
    invalid: UserCredentials;
  };
  products: {
    laptop: string;
    phone: string;
    monitor: string;
  };
  categories: string[];
}

export interface ApiResponse<T = any> {
  status: number;
  data: T;
  message?: string;
  error?: string;
}