const {
  handler,
  handleHello,
  handleHealth,
  handleRoot,
  handleOptions,
  handleNotFound,
  createResponse,
} = require('../src/lambda');

// Mock API Gateway event structure
const createEvent = (method, path, headers = {}) => ({
  requestContext: {
    http: {
      method,
      path,
      sourceIp: '127.0.0.1',
    },
    requestId: 'test-request-id',
  },
  headers,
});

describe('Lambda Function Tests', () => {
  describe('Utility Functions', () => {
    test('createResponse should format response correctly', () => {
      const response = createResponse(200, { message: 'test' });

      expect(response.statusCode).toBe(200);
      expect(response.headers).toHaveProperty('Access-Control-Allow-Origin');
      expect(response.headers).toHaveProperty(
        'Content-Type',
        'application/json'
      );
      expect(JSON.parse(response.body)).toEqual({ message: 'test' });
    });

    test('createResponse should handle text content', () => {
      const response = createResponse(200, 'OK', 'text/plain');

      expect(response.statusCode).toBe(200);
      expect(response.headers['Content-Type']).toBe('text/plain');
      expect(response.body).toBe('OK');
    });
  });

  describe('Route Handlers', () => {
    test('handleHello should return OK', () => {
      const response = handleHello();

      expect(response.statusCode).toBe(200);
      expect(response.body).toBe('OK');
      expect(response.headers['Content-Type']).toBe('text/plain');
    });

    test('handleHealth should return health status', () => {
      const response = handleHealth();
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(body.status).toBe('healthy');
      expect(body).toHaveProperty('timestamp');
      expect(body).toHaveProperty('version');
      expect(body.environment).toBe('serverless');
    });

    test('handleRoot should return application info', () => {
      const response = handleRoot();
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(body.message).toContain('Hello Hexaware DevOps Test');
      expect(body).toHaveProperty('endpoints');
      expect(body).toHaveProperty('timestamp');
      expect(body).toHaveProperty('architecture');
      expect(body.endpoints).toHaveProperty('/hello');
      expect(body.endpoints).toHaveProperty('/health');
    });

    test('handleOptions should return CORS response', () => {
      const response = handleOptions();

      expect(response.statusCode).toBe(200);
      expect(response.body).toBe('');
      expect(response.headers).toHaveProperty('Access-Control-Allow-Origin');
      expect(response.headers).toHaveProperty('Access-Control-Allow-Methods');
    });

    test('handleNotFound should return 404', () => {
      const response = handleNotFound();
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(404);
      expect(body.error).toBe('Not Found');
      expect(body).toHaveProperty('availableEndpoints');
      expect(body.availableEndpoints).toContain('/hello');
    });
  });

  describe('Main Handler Integration Tests', () => {
    test('should handle GET /hello', async () => {
      const event = createEvent('GET', '/hello');
      const response = await handler(event);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBe('OK');
    });

    test('should handle GET /health', async () => {
      const event = createEvent('GET', '/health');
      const response = await handler(event);
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(body.status).toBe('healthy');
    });

    test('should handle GET /', async () => {
      const event = createEvent('GET', '/');
      const response = await handler(event);
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(200);
      expect(body.message).toContain('Hello Hexaware DevOps Test');
    });

    test('should handle OPTIONS requests', async () => {
      const event = createEvent('OPTIONS', '/hello');
      const response = await handler(event);

      expect(response.statusCode).toBe(200);
      expect(response.headers).toHaveProperty('Access-Control-Allow-Methods');
    });

    test('should return 404 for unknown routes', async () => {
      const event = createEvent('GET', '/nonexistent');
      const response = await handler(event);
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(404);
      expect(body.error).toBe('Not Found');
    });

    test('should handle errors gracefully', async () => {
      // Create a malformed event to trigger error handling
      const malformedEvent = { requestContext: null };
      const response = await handler(malformedEvent);
      const body = JSON.parse(response.body);

      expect(response.statusCode).toBe(500);
      expect(body.error).toBe('Internal Server Error');
    });
  });

  describe('Security Headers', () => {
    test('should include security headers in all responses', async () => {
      const event = createEvent('GET', '/hello');
      const response = await handler(event);

      expect(response.headers).toHaveProperty(
        'X-Content-Type-Options',
        'nosniff'
      );
      expect(response.headers).toHaveProperty('X-Frame-Options', 'DENY');
      expect(response.headers).toHaveProperty(
        'X-XSS-Protection',
        '1; mode=block'
      );
      expect(response.headers).toHaveProperty('Strict-Transport-Security');
      expect(response.headers).toHaveProperty('Referrer-Policy');
    });

    test('should include CORS headers', async () => {
      const event = createEvent('GET', '/hello');
      const response = await handler(event);

      expect(response.headers).toHaveProperty('Access-Control-Allow-Origin');
      expect(response.headers).toHaveProperty('Access-Control-Allow-Methods');
      expect(response.headers).toHaveProperty('Access-Control-Allow-Headers');
    });
  });
});
