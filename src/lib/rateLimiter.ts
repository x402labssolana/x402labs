/**
 * Helius API Rate Limiter
 * Ensures we never exceed 10 requests per second to Helius API
 * Handles 100-200 concurrent users by queuing requests
 */

interface QueuedRequest {
  id: string;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  request: () => Promise<any>;
  timestamp: number;
}

interface RateLimitStatus {
  requestsInLastSecond: number;
  queueLength: number;
  isThrottled: boolean;
  nextAvailableSlot: number;
}

class HeliusRateLimiter {
  private queue: QueuedRequest[] = [];
  private requestTimes: number[] = [];
  private isProcessing = false;
  private readonly maxRequestsPerSecond = 8; // Keep 2 request buffer for safety
  private readonly timeWindow = 1000; // 1 second in milliseconds
  private readonly maxQueueSize = 1000; // Prevent memory issues
  private requestIdCounter = 0;

  /**
   * Add a request to the queue and return a promise that resolves when the request is processed
   */
  async addRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // Check if queue is too large
      if (this.queue.length >= this.maxQueueSize) {
        reject(new Error('Rate limiter queue is full. Please try again later.'));
        return;
      }

      const requestId = `req_${++this.requestIdCounter}_${Date.now()}`;
      const queuedRequest: QueuedRequest = {
        id: requestId,
        resolve,
        reject,
        request: requestFn,
        timestamp: Date.now()
      };

      this.queue.push(queuedRequest);
      this.processQueue();
    });
  }

  /**
   * Process the queue respecting rate limits
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      // Clean old request times (older than 1 second)
      const now = Date.now();
      this.requestTimes = this.requestTimes.filter(time => now - time < this.timeWindow);

      // Check if we can make a request
      if (this.requestTimes.length >= this.maxRequestsPerSecond) {
        // Wait until we can make another request
        const oldestRequestTime = Math.min(...this.requestTimes);
        const waitTime = this.timeWindow - (now - oldestRequestTime) + 50; // Add 50ms buffer for safety
        
        console.log(`Rate limit reached. Waiting ${waitTime}ms before next request. Queue length: ${this.queue.length}`);
        await this.sleep(waitTime);
        continue;
      }

      // Process the next request
      const queuedRequest = this.queue.shift();
      if (!queuedRequest) break;

      try {
        // Record this request time
        this.requestTimes.push(Date.now());
        
        // Execute the request
        const result = await queuedRequest.request();
        queuedRequest.resolve(result);
        
        console.log(`Request ${queuedRequest.id} completed. Requests in last second: ${this.requestTimes.length}, Queue: ${this.queue.length}`);
      } catch (error) {
        queuedRequest.reject(error);
        console.error(`Request ${queuedRequest.id} failed:`, error);
      }
    }

    this.isProcessing = false;
  }

  /**
   * Get current rate limit status
   */
  getStatus(): RateLimitStatus {
    const now = Date.now();
    const recentRequests = this.requestTimes.filter(time => now - time < this.timeWindow);
    
    return {
      requestsInLastSecond: recentRequests.length,
      queueLength: this.queue.length,
      isThrottled: recentRequests.length >= this.maxRequestsPerSecond,
      nextAvailableSlot: recentRequests.length > 0 ? 
        Math.min(...recentRequests) + this.timeWindow : 0
    };
  }

  /**
   * Get estimated wait time for a new request
   */
  getEstimatedWaitTime(): number {
    const status = this.getStatus();
    if (!status.isThrottled) return 0;
    
    const now = Date.now();
    const oldestRequestTime = Math.min(...this.requestTimes);
    const timeUntilNextSlot = (oldestRequestTime + this.timeWindow) - now;
    
    return Math.max(0, timeUntilNextSlot + (this.queue.length * 100)); // Estimate 100ms per queued request
  }

  /**
   * Clear the queue (for testing or emergency situations)
   */
  clearQueue(): void {
    this.queue.forEach(request => {
      request.reject(new Error('Queue cleared'));
    });
    this.queue = [];
  }

  /**
   * Sleep utility function
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Create a singleton instance
export const heliusRateLimiter = new HeliusRateLimiter();

/**
 * Wrapper function for Helius API calls that automatically applies rate limiting
 */
export async function makeHeliusRequest<T>(
  requestFn: () => Promise<T>,
  requestType: string = 'unknown'
): Promise<T> {
  console.log(`Queuing Helius request: ${requestType}`);
  return heliusRateLimiter.addRequest(requestFn);
}

/**
 * Hook to get rate limiter status for UI display
 */
export function useRateLimiterStatus() {
  const [status, setStatus] = useState<RateLimitStatus>({
    requestsInLastSecond: 0,
    queueLength: 0,
    isThrottled: false,
    nextAvailableSlot: 0
  });

  useEffect(() => {
    const updateStatus = () => {
      setStatus(heliusRateLimiter.getStatus());
    };

    // Update status every 100ms for real-time display
    const interval = setInterval(updateStatus, 100);
    updateStatus(); // Initial update

    return () => clearInterval(interval);
  }, []);

  return status;
}

// Import React hooks for the hook function
import { useState, useEffect } from 'react';
