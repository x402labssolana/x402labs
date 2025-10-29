/**
 * Browser-based Rate Limiting Test
 * Tests the actual rate limiting system through the web application
 */

const puppeteer = require('puppeteer');

class BrowserRateLimitTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
  }

  async init() {
    console.log('🚀 Starting browser...');
    this.browser = await puppeteer.launch({ 
      headless: false, // Set to true for headless mode
      defaultViewport: null,
      args: ['--start-maximized']
    });
    this.page = await this.browser.newPage();
    
    // Enable console logging
    this.page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('Rate limit')) {
        console.log('📊 Browser Console:', msg.text());
      }
    });
  }

  async navigateToApp() {
    console.log('🌐 Navigating to application...');
    await this.page.goto('http://localhost:3000/trading-agent', { 
      waitUntil: 'networkidle2' 
    });
    
    // Wait for the page to load
    await this.page.waitForSelector('[data-testid="rate-limit-status"]', { timeout: 10000 });
    console.log('✅ Application loaded successfully');
  }

  async testRateLimitStatus() {
    console.log('\n📊 Testing rate limit status display...');
    
    try {
      // Check if rate limit status is visible
      const statusElement = await this.page.$('[data-testid="rate-limit-status"]');
      if (statusElement) {
        const statusText = await this.page.evaluate(el => el.textContent, statusElement);
        console.log('✅ Rate limit status found:', statusText);
      } else {
        console.log('⚠️  Rate limit status element not found');
      }
    } catch (error) {
      console.log('❌ Error checking rate limit status:', error.message);
    }
  }

  async testTokenDataFetching() {
    console.log('\n🪙 Testing token data fetching with rate limiting...');
    
    try {
      // Click on "Create New Agent" to access the input form
      await this.page.click('button:contains("Create New Agent")');
      await this.page.waitForTimeout(1000);
      
      // Fill in a test token address
      const testToken = 'So11111111111111111111111111111111111111112'; // SOL
      await this.page.type('input[placeholder*="token"]', testToken);
      
      // Click analyze button to trigger API calls
      const analyzeButton = await this.page.$('button:contains("Analyze")');
      if (analyzeButton) {
        console.log('🔄 Triggering token analysis...');
        await analyzeButton.click();
        
        // Wait for API calls to complete
        await this.page.waitForTimeout(5000);
        
        // Check for any rate limiting indicators
        const rateLimitWarning = await this.page.$('.text-red-400, .text-yellow-400');
        if (rateLimitWarning) {
          const warningText = await this.page.evaluate(el => el.textContent, rateLimitWarning);
          console.log('⚠️  Rate limit warning detected:', warningText);
        } else {
          console.log('✅ No rate limit warnings detected');
        }
      }
    } catch (error) {
      console.log('❌ Error testing token data fetching:', error.message);
    }
  }

  async testConcurrentRequests() {
    console.log('\n🚀 Testing concurrent requests through UI...');
    
    try {
      // Open multiple tabs to simulate concurrent users
      const tabs = [];
      for (let i = 0; i < 5; i++) {
        const tab = await this.browser.newPage();
        await tab.goto('http://localhost:3000/trading-agent');
        await tab.waitForSelector('[data-testid="rate-limit-status"]', { timeout: 10000 });
        tabs.push(tab);
      }
      
      console.log('📱 Opened 5 concurrent tabs');
      
      // Trigger API calls from all tabs simultaneously
      const promises = tabs.map(async (tab, index) => {
        try {
          // Click create agent button
          await tab.click('button:contains("Create New Agent")');
          await tab.waitForTimeout(500);
          
          // Fill in token address
          const testToken = `So1111111111111111111111111111111111111111${index}`;
          await tab.type('input[placeholder*="token"]', testToken);
          
          // Click analyze
          const analyzeButton = await tab.$('button:contains("Analyze")');
          if (analyzeButton) {
            await analyzeButton.click();
          }
          
          return { tab: index, success: true };
        } catch (error) {
          return { tab: index, success: false, error: error.message };
        }
      });
      
      const results = await Promise.all(promises);
      const successCount = results.filter(r => r.success).length;
      
      console.log(`✅ Concurrent test completed: ${successCount}/5 tabs successful`);
      
      // Close tabs
      for (const tab of tabs) {
        await tab.close();
      }
      
    } catch (error) {
      console.log('❌ Error testing concurrent requests:', error.message);
    }
  }

  async monitorRateLimitStatus() {
    console.log('\n👀 Monitoring rate limit status for 30 seconds...');
    
    const startTime = Date.now();
    const endTime = startTime + 30000; // 30 seconds
    
    while (Date.now() < endTime) {
      try {
        // Get current rate limit status
        const statusElement = await this.page.$('[data-testid="rate-limit-status"]');
        if (statusElement) {
          const statusText = await this.page.evaluate(el => el.textContent, statusElement);
          const timestamp = new Date().toLocaleTimeString();
          console.log(`[${timestamp}] Status: ${statusText}`);
        }
        
        // Wait 2 seconds before next check
        await this.page.waitForTimeout(2000);
      } catch (error) {
        console.log('❌ Error monitoring status:', error.message);
        break;
      }
    }
  }

  async runAllTests() {
    try {
      await this.init();
      await this.navigateToApp();
      await this.testRateLimitStatus();
      await this.testTokenDataFetching();
      await this.testConcurrentRequests();
      await this.monitorRateLimitStatus();
      
      console.log('\n🎉 All browser tests completed!');
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the tests
const tester = new BrowserRateLimitTester();
tester.runAllTests().catch(console.error);
