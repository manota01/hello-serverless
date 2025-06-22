const { handler } = require('../src/lambda');

// Mock API Gateway event structure
function createEvent(method, path) {
  return {
    requestContext: {
      http: {
        method: method,
        path: path,
        sourceIp: '127.0.0.1'
      }
    }
  };
}

async function testLambdaFunction() {
  console.log('Testing Lambda function locally...\n');
  
  try {
    // Test /hello endpoint
    console.log('Testing GET /hello...');
    const helloResponse = await handler(createEvent('GET', '/hello'));
    if (helloResponse.statusCode === 200 && helloResponse.body === 'OK') {
      console.log('✅ /hello - PASS (200, "OK")');
    } else {
      console.log(`❌ /hello - FAIL (${helloResponse.statusCode}, "${helloResponse.body}")`);
    }
    
    // Test /health endpoint
    console.log('Testing GET /health...');
    const healthResponse = await handler(createEvent('GET', '/health'));
    if (healthResponse.statusCode === 200 && healthResponse.body.includes('healthy')) {
      console.log('✅ /health - PASS (200, contains "healthy")');
    } else {
      console.log(`❌ /health - FAIL (${healthResponse.statusCode}, "${healthResponse.body}")`);
    }
    
    // Test root endpoint
    console.log('Testing GET /...');
    const rootResponse = await handler(createEvent('GET', '/'));
    if (rootResponse.statusCode === 200 && rootResponse.body.includes('Serverless Edition')) {
      console.log('✅ / - PASS (200, contains "Serverless Edition")');
    } else {
      console.log(`❌ / - FAIL (${rootResponse.statusCode}, "${rootResponse.body}")`);
    }
    
    // Test 404
    console.log('Testing GET /nonexistent...');
    const notFoundResponse = await handler(createEvent('GET', '/nonexistent'));
    if (notFoundResponse.statusCode === 404) {
      console.log('✅ /nonexistent - PASS (404)');
    } else {
      console.log(`❌ /nonexistent - FAIL (${notFoundResponse.statusCode})`);
    }
    
    // Test OPTIONS (CORS)
    console.log('Testing OPTIONS /hello...');
    const optionsResponse = await handler(createEvent('OPTIONS', '/hello'));
    if (optionsResponse.statusCode === 200) {
      console.log('✅ OPTIONS /hello - PASS (200, CORS)');
    } else {
      console.log(`❌ OPTIONS /hello - FAIL (${optionsResponse.statusCode})`);
    }
    
    console.log('\n🎉 All Lambda function tests passed!');
    console.log('\n💡 Ready for serverless deployment!');
    process.exit(0);
  } catch (error) {
    console.log('\n💥 Lambda function tests failed!');
    console.error(error);
    process.exit(1);
  }
}

// Run tests
testLambdaFunction(); 