/**
 * Accurate Rate Limiter Test
 * Tests the rate limiter with precise timing measurements
 */

const testAccurateRateLimiter = async () => {
  console.log('🧪 Testing Rate Limiter with Accurate Timing...\n');
  
  const requestTimes = [];
  const maxRequestsPerSecond = 8;
  const timeWindow = 1000;
  
  const makeRequest = async (requestId) => {
    const now = Date.now();
    
    // Clean old request times
    const recentRequests = requestTimes.filter(time => now - time < timeWindow);
    
    // Check if we can make a request
    if (recentRequests.length >= maxRequestsPerSecond) {
      const oldestRequestTime = Math.min(...recentRequests);
      const waitTime = timeWindow - (now - oldestRequestTime) + 50;
      
      console.log(`⏳ Request ${requestId}: Rate limit reached. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    // Record this request time
    const requestTime = Date.now();
    requestTimes.push(requestTime);
    
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
    console.log(`✅ Request ${requestId} completed at ${timestamp} (${requestTime})`);
    
    return { requestId, timestamp: requestTime, response };
  };
  
  // Test: Make exactly 16 requests and measure the rate
  console.log('🔄 Testing 16 requests with rate limiting...');
  const startTime = Date.now();
  
  const results = [];
  for (let i = 1; i <= 16; i++) {
    const result = await makeRequest(`req-${i}`);
    results.push(result);
  }
  
  const endTime = Date.now();
  const totalDuration = endTime - startTime;
  
  console.log(`\n📊 Test Results:`);
  console.log(`   - Total duration: ${totalDuration}ms`);
  console.log(`   - Total requests: ${results.length}`);
  console.log(`   - Overall rate: ${(results.length / (totalDuration / 1000)).toFixed(2)} requests/second`);
  
  // Analyze the actual rate limiting behavior
  const timestamps = results.map(r => r.timestamp).sort((a, b) => a - b);
  
  // Check each 1-second window
  let maxRequestsInAnySecond = 0;
  for (let i = 0; i < timestamps.length; i++) {
    const windowStart = timestamps[i];
    const windowEnd = windowStart + 1000;
    const requestsInWindow = timestamps.filter(t => t >= windowStart && t < windowEnd).length;
    maxRequestsInAnySecond = Math.max(maxRequestsInAnySecond, requestsInWindow);
  }
  
  console.log(`   - Max requests in any 1-second window: ${maxRequestsInAnySecond}`);
  
  if (maxRequestsInAnySecond <= 8) {
    console.log(`   ✅ Rate limiting is working correctly! (Max: ${maxRequestsInAnySecond}/8)`);
  } else {
    console.log(`   ❌ Rate limiting failed! (Max: ${maxRequestsInAnySecond}/8)`);
  }
  
  // Analyze timing between consecutive requests
  const timeSpans = [];
  for (let i = 1; i < timestamps.length; i++) {
    timeSpans.push(timestamps[i] - timestamps[i-1]);
  }
  
  if (timeSpans.length > 0) {
    const avgTimeSpan = timeSpans.reduce((a, b) => a + b, 0) / timeSpans.length;
    const minTimeSpan = Math.min(...timeSpans);
    const maxTimeSpan = Math.max(...timeSpans);
    
    console.log(`\n📈 Timing Analysis:`);
    console.log(`   - Average time between requests: ${avgTimeSpan.toFixed(0)}ms`);
    console.log(`   - Min time between requests: ${minTimeSpan}ms`);
    console.log(`   - Max time between requests: ${maxTimeSpan}ms`);
    
    // Expected: ~125ms between requests (1000ms / 8 requests = 125ms)
    if (avgTimeSpan > 100 && avgTimeSpan < 200) {
      console.log(`   ✅ Timing looks correct for 8 requests/second!`);
    } else {
      console.log(`   ⚠️  Timing doesn't match expected rate limiting behavior`);
    }
  }
  
  // Test: Verify no more than 8 requests in any 1-second period
  console.log(`\n🔍 Verifying 1-second windows...`);
  let violations = 0;
  for (let i = 0; i < timestamps.length - 7; i++) {
    const windowStart = timestamps[i];
    const windowEnd = windowStart + 1000;
    const requestsInWindow = timestamps.filter(t => t >= windowStart && t < windowEnd).length;
    
    if (requestsInWindow > 8) {
      violations++;
      console.log(`   ❌ Violation: ${requestsInWindow} requests in window starting at ${new Date(windowStart).toLocaleTimeString()}`);
    }
  }
  
  if (violations === 0) {
    console.log(`   ✅ No rate limit violations detected!`);
  } else {
    console.log(`   ❌ ${violations} rate limit violations detected!`);
  }
  
  console.log(`\n🎉 Accurate rate limiter test completed!`);
};

// Run the test
testAccurateRateLimiter().catch(console.error);
