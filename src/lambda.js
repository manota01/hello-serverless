// AWS Lambda handler for HelloHexa DevOps Test
// Refactored for better maintainability and error handling

// Configuration from environment variables
const CONFIG = {
  VERSION: process.env.APP_VERSION || '1.1.0',
  ENVIRONMENT: process.env.ENVIRONMENT || 'serverless',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  RATE_LIMIT: process.env.RATE_LIMIT || '100 req/s',
};

// Security headers configuration
const getSecurityHeaders = () => ({
  'Access-Control-Allow-Origin': CONFIG.CORS_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
});

// Utility function to create responses
const createResponse = (
  statusCode,
  body,
  contentType = 'application/json'
) => ({
  statusCode,
  headers: {
    ...getSecurityHeaders(),
    'Content-Type': contentType,
  },
  body: typeof body === 'string' ? body : JSON.stringify(body),
});

// Route handlers
const handleHello = () => {
  console.log('Processing /hello request');
  return createResponse(200, 'OK', 'text/plain');
};

const handleHealth = () => {
  console.log('Processing /health request');
  return createResponse(200, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: CONFIG.VERSION,
    environment: CONFIG.ENVIRONMENT,
    security: 'enabled',
  });
};

const handleRoot = () => {
  console.log('Processing / request');
  return createResponse(200, {
    message: 'Hello Hexaware DevOps Test - Secured Serverless Edition',
    endpoints: {
      '/hello': 'Public - Returns OK as per requirements',
      '/health': 'Public - Health check',
      '/': 'Public - This endpoint',
    },
    timestamp: new Date().toISOString(),
    architecture: 'AWS Lambda + API Gateway + WAF',
    version: CONFIG.VERSION,
    security: {
      waf: 'enabled',
      rateLimit: CONFIG.RATE_LIMIT,
      headers: 'security headers applied',
      authentication: 'not required - public endpoints',
    },
  });
};

const handleOptions = () => {
  console.log('Processing OPTIONS request (CORS preflight)');
  return createResponse(200, '', 'text/plain');
};

const handleNotFound = () => {
  console.log('Processing 404 request');
  return createResponse(404, {
    error: 'Not Found',
    message: 'The requested resource was not found',
    timestamp: new Date().toISOString(),
    availableEndpoints: ['/hello', '/health', '/'],
  });
};

// Route mapping
const routes = {
  'GET /hello': handleHello,
  'GET /health': handleHealth,
  'GET /': handleRoot,
  OPTIONS: handleOptions,
};

// Main handler with error handling
exports.handler = async (event) => {
  try {
    // Log the request for monitoring
    const { method } = event.requestContext.http;
    const path = event.requestContext.http.path;
    const sourceIp = event.requestContext.http.sourceIp;

    console.log(
      `${new Date().toISOString()} - ${method} ${path} - ${sourceIp}`
    );

    // Handle OPTIONS requests (CORS preflight)
    if (method === 'OPTIONS') {
      return handleOptions();
    }

    // Route the request
    const routeKey = `${method} ${path}`;
    const handler = routes[routeKey];

    if (handler) {
      return handler();
    }

    // Default to 404
    return handleNotFound();
  } catch (error) {
    console.error('Lambda execution error:', error);
    return createResponse(500, {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      requestId: event.requestContext?.requestId || 'unknown',
    });
  }
};

// Export functions for testing
module.exports = {
  handler: exports.handler,
  handleHello,
  handleHealth,
  handleRoot,
  handleOptions,
  handleNotFound,
  createResponse,
};
