// AWS Lambda handler for HelloHexa DevOps Test

// For Node.js 18, AWS SDK is not included by default
// Using a simple implementation without AWS SDK for now
let cachedApiKey = 'hx-dev-2024-secure-api-key-abc123xyz'; // Simplified for demo
let cacheExpiry = 0;

// Simplified API key validation (demo version)
const validateApiKey = async (providedKey) => {
    if (!providedKey) {
        return false;
    }
    
    // For demo: validate against the hardcoded key
    return providedKey === cachedApiKey;
};

exports.handler = async (event) => {
    // Log the request for monitoring
    console.log(`${new Date().toISOString()} - ${event.requestContext.http.method} ${event.requestContext.http.path} - ${event.requestContext.http.sourceIp}`);
    
    const { method } = event.requestContext.http;
    // For $default stage, path comes clean without stage prefix
    let path = event.requestContext.http.path;
    
    // Enhanced security headers
    const securityHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
    };
    
    // Handle preflight requests
    if (method === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: securityHeaders,
            body: ''
        };
    }
    
    // API Key validation removed - /hello is now public as per original requirements
    
    // Handle /hello endpoint (public - as per original requirements)
    if (method === 'GET' && path === '/hello') {
        return {
            statusCode: 200,
            headers: {
                ...securityHeaders,
                'Content-Type': 'text/plain'
            },
            body: 'OK'
        };
    }
    
    // Handle health check endpoint (public)
    if (method === 'GET' && path === '/health') {
        return {
            statusCode: 200,
            headers: {
                ...securityHeaders,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                environment: 'serverless',
                security: 'enabled'
            })
        };
    }
    
    // Handle root endpoint (public)
    if (method === 'GET' && path === '/') {
        return {
            statusCode: 200,
            headers: {
                ...securityHeaders,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Hello Hexaware DevOps Test - Secured Serverless Edition',
                endpoints: {
                    '/hello': 'Public - Returns OK as per requirements',
                    '/health': 'Public - Health check',
                    '/': 'Public - This endpoint'
                },
                timestamp: new Date().toISOString(),
                architecture: 'AWS Lambda + API Gateway + WAF',
                version: '1.1.0',
                security: {
                    waf: 'enabled',
                    rateLimit: '100 req/s',
                    headers: 'security headers applied',
                    authentication: 'not required - public endpoints'
                }
            })
        };
    }
    
    // Handle 404
    return {
        statusCode: 404,
        headers: {
            ...securityHeaders,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            error: 'Not Found',
            message: 'The requested resource was not found',
            timestamp: new Date().toISOString(),
            availableEndpoints: ['/hello', '/health', '/']
        })
    };
}; 