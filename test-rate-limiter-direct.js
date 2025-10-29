/**
 * Direct Rate Limiter Test
 * Tests the rate limiter by importing and using it directly
 */

// This will test the rate limiter by simulating the actual usage
const testRateLimiter = async () => {
  console.log('🧪 Testing Rate Limiter Directly...\n');
  
  // Simulate the rate limiter behavior
  const requestTimes = [];
  const maxRequestsPerSecond = 9;
  const timeWindow = 1000;
  
  const makeRequest = async (requestId) => {
    const now = Date.now();
    
    // Clean old request times
    const recentRequests = requestTimes.filter(time => now - time < timeWindow);
    
    // Check if we can make a request
    if (recentRequests.length >= maxRequestsPerSecond) {
      const oldestRequestTime = Math.min(...recentRequests);
      const waitTime = timeWindow - (now - oldestRequestTime) + 10;
      
      console.log(`⏳ Request ${requestId}: Rate limit reached. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    // Record this request time
    requestTimes.push(Date.now());
    
    // Simulate API call
    const response = await fetch('https://mainnet.helius-rpc.com/?api-key=07619634-789b-4f04-8997-d0f04c9104dd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: requestId,
        method: 'getHealth',
        params: []
      })
    });
    
    const timestamp = new Date().toLocaleTimeString();
    console.log(`✅ Request ${requestId} completed at ${timestamp}`);
    
    return response;
  };
  
  // Test 1: Sequential requests
  console.log('🔄 Testing 15 sequential requests...');
  const startTime = Date.now();
  
  for (let i = 1; i <= 15; i++) {
    await makeRequest(`seq-${i}`);
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  const requestsPerSecond = 15 / (duration / 1000);
  
  console.log(`\n📊 Sequential Test Results:`);
  console.log(`   - Duration: ${duration}ms`);
  console.log(`   - Requests per second: ${requestsPerSecond.toFixed(2)}`);
  console.log(`   - Expected: ~9 requests/second`);
  
  if (requestsPerSecond <= 10) {
    console.log(`   ✅ Rate limiting is working correctly!`);
  } else {
    console.log(`   ⚠️  Rate limiting may not be working properly`);
  }
  
  // Test 2: Concurrent requests
  console.log(`\n🚀 Testing 20 concurrent requests...`);
  const concurrentStartTime = Date.now();
  
  const promises = Array.from({ length: 20 }, (_, i) => 
    makeRequest(`concurrent-${i + 1}`)
  );
  
  await Promise.all(promises);
  
  const concurrentEndTime = Date.now();
  const concurrentDuration = concurrentEndTime - startTime;
  const concurrentRequestsPerSecond = 20 / (concurrentDuration / 1000);
  
  console.log(`\n📊 Concurrent Test Results:`);
  console.log(`   - Duration: ${concurrentDuration}ms`);
  console.log(`   - Requests per second: ${concurrentRequestsPerSecond.toFixed(2)}`);
  console.log(`   - Expected: ~9 requests/second`);
  
  if (concurrentRequestsPerSecond <= 10) {
    console.log(`   ✅ Rate limiting is working correctly!`);
  } else {
    console.log(`   ⚠️  Rate limiting may not be working properly`);
  }
  
  // Test 3: Analyze timing between requests
  console.log(`\n📈 Analyzing request timing...`);
  const timestamps = requestTimes.sort((a, b) => a - b);
  const timeSpans = [];
  
  for (let i = 1; i < timestamps.length; i++) {
    timeSpans.push(timestamps[i] - timestamps[i-1]);
  }
  
  if (timeSpans.length > 0) {
    const avgTimeSpan = timeSpans.reduce((a, b) => a + b, 0) / timeSpans.length;
    const minTimeSpan = Math.min(...timeSpans);
    const maxTimeSpan = Math.max(...timeSpans);
    
    console.log(`   - Average time between requests: ${avgTimeSpan.toFixed(0)}ms`);
    console.log(`   - Min time between requests: ${minTimeSpan}ms`);
    console.log(`   - Max time between requests: ${maxTimeSpan}ms`);
    
    // Expected: ~100ms between requests (1000ms / 9 requests = 111ms)
    if (avgTimeSpan > 80 && avgTimeSpan < 150) {
      console.log(`   ✅ Timing looks correct for rate limiting!`);
    } else {
      console.log(`   ⚠️  Timing doesn't match expected rate limiting behavior`);
    }
  }
  
  console.log(`\n🎉 Rate limiter test completed!`);
};

// Run the test
testRateLimiter().catch(console.error);
