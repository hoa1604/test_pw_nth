import { APIRequestContext, request, expect } from '@playwright/test';
import { config } from '../config/config';
import { ApiResponse } from '../types';

export class ApiHelper {
  private apiContext: APIRequestContext;

  constructor(apiContext?: APIRequestContext) {
    this.apiContext = apiContext || request.newContext({
      baseURL: config.apiBaseUrl,
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Initialize API context
   */
  static async create(): Promise<ApiHelper> {
    const apiContext = await request.newContext({
      baseURL: config.apiBaseUrl,
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return new ApiHelper(apiContext);
  }

  /**
   * GET request
   */
  async get(endpoint: string, options?: { 
    params?: Record<string, any>;
    headers?: Record<string, string>;
    timeout?: number;
  }): Promise<ApiResponse> {
    try {
      const response = await this.apiContext.get(endpoint, {
        params: options?.params,
        headers: options?.headers,
        timeout: options?.timeout || 30000,
      });

      const data = await this.parseResponse(response);
      
      return {
        status: response.status(),
        data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * POST request
   */
  async post(endpoint: string, data?: any, options?: {
    headers?: Record<string, string>;
    timeout?: number;
  }): Promise<ApiResponse> {
    try {
      const response = await this.apiContext.post(endpoint, {
        data,
        headers: options?.headers,
        timeout: options?.timeout || 30000,
      });

      const responseData = await this.parseResponse(response);
      
      return {
        status: response.status(),
        data: responseData,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PUT request
   */
  async put(endpoint: string, data?: any, options?: {
    headers?: Record<string, string>;
    timeout?: number;
  }): Promise<ApiResponse> {
    try {
      const response = await this.apiContext.put(endpoint, {
        data,
        headers: options?.headers,
        timeout: options?.timeout || 30000,
      });

      const responseData = await this.parseResponse(response);
      
      return {
        status: response.status(),
        data: responseData,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * DELETE request
   */
  async delete(endpoint: string, options?: {
    headers?: Record<string, string>;
    timeout?: number;
  }): Promise<ApiResponse> {
    try {
      const response = await this.apiContext.delete(endpoint, {
        headers: options?.headers,
        timeout: options?.timeout || 30000,
      });

      const responseData = await this.parseResponse(response);
      
      return {
        status: response.status(),
        data: responseData,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * PATCH request
   */
  async patch(endpoint: string, data?: any, options?: {
    headers?: Record<string, string>;
    timeout?: number;
  }): Promise<ApiResponse> {
    try {
      const response = await this.apiContext.patch(endpoint, {
        data,
        headers: options?.headers,
        timeout: options?.timeout || 30000,
      });

      const responseData = await this.parseResponse(response);
      
      return {
        status: response.status(),
        data: responseData,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Parse response based on content type
   */
  private async parseResponse(response: any): Promise<any> {
    const contentType = response.headers()['content-type'] || '';
    
    if (contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch {
        return await response.text();
      }
    }
    
    return await response.text();
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): ApiResponse {
    return {
      status: 0,
      data: null,
      error: error.message || 'API request failed',
    };
  }

  /**
   * Verify response status
   */
  async verifyResponseStatus(response: ApiResponse, expectedStatus: number): Promise<void> {
    expect(response.status).toBe(expectedStatus);
  }

  /**
   * Verify response contains expected data
   */
  async verifyResponseData(response: ApiResponse, expectedData: any): Promise<void> {
    expect(response.data).toEqual(expect.objectContaining(expectedData));
  }

  /**
   * Close API context
   */
  async dispose(): Promise<void> {
    await this.apiContext.dispose();
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    // This would be implemented based on the API's authentication method
    // Example: Bearer token, API key, etc.
  }

  /**
   * Upload file via API
   */
  async uploadFile(endpoint: string, filePath: string, fieldName: string = 'file'): Promise<ApiResponse> {
    try {
      const response = await this.apiContext.post(endpoint, {
        multipart: {
          [fieldName]: filePath,
        },
      });

      const data = await this.parseResponse(response);
      
      return {
        status: response.status(),
        data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/');
      return response.status >= 200 && response.status < 400;
    } catch {
      return false;
    }
  }
}