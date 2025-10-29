/**
 * Rate Limiting Test Script
 * Tests the Helius API rate limiting system with concurrent requests
 */

// Dynamic import for node-fetch
let fetch;

// Test configuration
const HELIUS_API_KEY = '07619634-789b-4f04-8997-d0f04c9104dd';
const HELIUS_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
const TEST_REQUESTS = 20;
const CONCURRENT_BATCHES = 3;

// Test data
const testTokens = [
  'So11111111111111111111111111111111111111112', // SOL
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK
  'mSoLzYCxHfYgqU9M8eZR5D2sN6tK4vJ8wP1qA3bC7eF9', // mSOL
];

class RateLimitTester {
  constructor() {
    this.results = [];
    this.startTime = null;
    this.endTime = null;
  }

  async makeHeliusRequest(requestId) {
    const payload = {
      jsonrpc: '2.0',
      id: requestId,
      method: 'getHealth',
      params: []
    };

    try {
      const response = await fetch(HELIUS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      return {
        id: requestId,
        success: response.ok,
        status: response.status,
        timestamp: Date.now(),
        data: data
      };
    } catch (error) {
      return {
        id: requestId,
        success: false,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  async testConcurrentRequests() {
    console.log(`\n🚀 Testing ${TEST_REQUESTS} concurrent requests...`);
    this.startTime = Date.now();

    const promises = [];
    for (let i = 0; i < TEST_REQUESTS; i++) {
      promises.push(this.makeHeliusRequest(`concurrent-${i}`));
    }

    try {
      const results = await Promise.all(promises);
      this.endTime = Date.now();
      
      const successCount = results.filter(r => r.success).length;
      const duration = this.endTime - this.startTime;
      
      console.log(`✅ Concurrent test completed:`);
      console.log(`   - Duration: ${duration}ms`);
      console.log(`   - Success rate: ${successCount}/${TEST_REQUESTS} (${(successCount/TEST_REQUESTS*100).toFixed(1)}%)`);
      console.log(`   - Average time per request: ${(duration/TEST_REQUESTS).toFixed(0)}ms`);
      
      return results;
    } catch (error) {
      console.error('❌ Concurrent test failed:', error);
      return [];
    }
  }

  async testSequentialRequests() {
    console.log(`\n🔄 Testing ${TEST_REQUESTS} sequential requests...`);
    this.startTime = Date.now();

    const results = [];
    for (let i = 0; i < TEST_REQUESTS; i++) {
      const result = await this.makeHeliusRequest(`sequential-${i}`);
      results.push(result);
      
      if (i % 5 === 0) {
        console.log(`   Processed ${i + 1}/${TEST_REQUESTS} requests...`);
      }
    }

    this.endTime = Date.now();
    const successCount = results.filter(r => r.success).length;
    const duration = this.endTime - this.startTime;
    
    console.log(`✅ Sequential test completed:`);
    console.log(`   - Duration: ${duration}ms`);
    console.log(`   - Success rate: ${successCount}/${TEST_REQUESTS} (${(successCount/TEST_REQUESTS*100).toFixed(1)}%)`);
    console.log(`   - Average time per request: ${(duration/TEST_REQUESTS).toFixed(0)}ms`);
    
    return results;
  }

  async testBurstRequests() {
    console.log(`\n💥 Testing burst requests (${CONCURRENT_BATCHES} batches of ${TEST_REQUESTS} requests)...`);
    this.startTime = Date.now();

    const allResults = [];
    
    for (let batch = 0; batch < CONCURRENT_BATCHES; batch++) {
      console.log(`   Starting batch ${batch + 1}/${CONCURRENT_BATCHES}...`);
      
      const promises = [];
      for (let i = 0; i < TEST_REQUESTS; i++) {
        promises.push(this.makeHeliusRequest(`burst-${batch}-${i}`));
      }
      
      const batchResults = await Promise.all(promises);
      allResults.push(...batchResults);
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.endTime = Date.now();
    const successCount = allResults.filter(r => r.success).length;
    const duration = this.endTime - this.startTime;
    
    console.log(`✅ Burst test completed:`);
    console.log(`   - Total requests: ${allResults.length}`);
    console.log(`   - Duration: ${duration}ms`);
    console.log(`   - Success rate: ${successCount}/${allResults.length} (${(successCount/allResults.length*100).toFixed(1)}%)`);
    console.log(`   - Requests per second: ${(allResults.length / (duration / 1000)).toFixed(1)}`);
    
    return allResults;
  }

  async testTokenDataRequests() {
    console.log(`\n🪙 Testing token data requests (${testTokens.length} tokens)...`);
    this.startTime = Date.now();

    const promises = testTokens.map((token, index) => 
      this.makeTokenRequest(token, `token-${index}`)
    );

    try {
      const results = await Promise.all(promises);
      this.endTime = Date.now();
      
      const successCount = results.filter(r => r.success).length;
      const duration = this.endTime - this.startTime;
      
      console.log(`✅ Token data test completed:`);
      console.log(`   - Duration: ${duration}ms`);
      console.log(`   - Success rate: ${successCount}/${testTokens.length} (${(successCount/testTokens.length*100).toFixed(1)}%)`);
      
      return results;
    } catch (error) {
      console.error('❌ Token data test failed:', error);
      return [];
    }
  }

  async makeTokenRequest(tokenAddress, requestId) {
    const payload = {
      jsonrpc: '2.0',
      id: requestId,
      method: 'getAsset',
      params: {
        id: tokenAddress,
        displayOptions: {
          showInscription: true,
        },
      },
    };

    try {
      const response = await fetch(HELIUS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      return {
        id: requestId,
        token: tokenAddress,
        success: response.ok,
        status: response.status,
        timestamp: Date.now(),
        hasSymbol: data.result?.content?.metadata?.symbol || data.result?.token_info?.symbol
      };
    } catch (error) {
      return {
        id: requestId,
        token: tokenAddress,
        success: false,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  analyzeResults(results) {
    if (results.length === 0) return;

    const successResults = results.filter(r => r.success);
    const failedResults = results.filter(r => !r.success);
    
    console.log(`\n📊 Analysis:`);
    console.log(`   - Total requests: ${results.length}`);
    console.log(`   - Successful: ${successResults.length}`);
    console.log(`   - Failed: ${failedResults.length}`);
    
    if (successResults.length > 0) {
      const timestamps = successResults.map(r => r.timestamp).sort();
      const timeSpans = [];
      for (let i = 1; i < timestamps.length; i++) {
        timeSpans.push(timestamps[i] - timestamps[i-1]);
      }
      
      const avgTimeSpan = timeSpans.reduce((a, b) => a + b, 0) / timeSpans.length;
      const minTimeSpan = Math.min(...timeSpans);
      const maxTimeSpan = Math.max(...timeSpans);
      
      console.log(`   - Average time between requests: ${avgTimeSpan.toFixed(0)}ms`);
      console.log(`   - Min time between requests: ${minTimeSpan}ms`);
      console.log(`   - Max time between requests: ${maxTimeSpan}ms`);
      
      // Check if rate limiting is working (should be ~100ms between requests)
      if (avgTimeSpan > 80 && avgTimeSpan < 200) {
        console.log(`   ✅ Rate limiting appears to be working correctly`);
      } else if (avgTimeSpan < 80) {
        console.log(`   ⚠️  Requests may be too fast - rate limiting might not be working`);
      } else {
        console.log(`   ⚠️  Requests are slower than expected - possible throttling`);
      }
    }
    
    if (failedResults.length > 0) {
      console.log(`\n❌ Failed requests:`);
      failedResults.forEach(result => {
        console.log(`   - ${result.id}: ${result.error || `Status ${result.status}`}`);
      });
    }
  }

  async runAllTests() {
    // Initialize fetch
    const { default: nodeFetch } = await import('node-fetch');
    fetch = nodeFetch;
    
    console.log('🧪 Starting Rate Limiting Tests...\n');
    console.log('=' .repeat(50));
    
    try {
      // Test 1: Concurrent requests
      const concurrentResults = await this.testConcurrentRequests();
      this.analyzeResults(concurrentResults);
      
      // Wait between tests
      console.log('\n⏳ Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Test 2: Sequential requests
      const sequentialResults = await this.testSequentialRequests();
      this.analyzeResults(sequentialResults);
      
      // Wait between tests
      console.log('\n⏳ Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Test 3: Burst requests
      const burstResults = await this.testBurstRequests();
      this.analyzeResults(burstResults);
      
      // Wait between tests
      console.log('\n⏳ Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Test 4: Token data requests
      const tokenResults = await this.testTokenDataRequests();
      this.analyzeResults(tokenResults);
      
      console.log('\n🎉 All tests completed!');
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }
}

// Run the tests
const tester = new RateLimitTester();
tester.runAllTests().catch(console.error);
