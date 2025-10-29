# Helius API Rate Limiting System

## Overview

This system implements comprehensive rate limiting for Helius API calls to ensure we never exceed the 10 requests per second limit, even with 100-200 concurrent users.

## Key Features

- **Queue-based System**: All Helius API requests are queued and processed sequentially
- **Rate Limiting**: Maximum 9 requests per second (1 request buffer for safety)
- **Real-time Monitoring**: Live status indicators showing current rate and queue length
- **Automatic Throttling**: Requests are automatically delayed when approaching limits
- **Error Handling**: Graceful handling of rate limit violations and timeouts
- **Memory Management**: Queue size limits prevent memory issues

## Components

### 1. Rate Limiter (`src/lib/rateLimiter.ts`)

The core rate limiting logic:

```typescript
import { makeHeliusRequest } from '@/lib/rateLimiter';

// All Helius API calls should use this wrapper
const response = await makeHeliusRequest(async () => {
  return fetch(heliusUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}, 'request-identifier');
```

**Key Methods:**
- `makeHeliusRequest(requestFn, identifier)`: Wraps API calls with rate limiting
- `heliusRateLimiter.getStatus()`: Get current rate limit status
- `heliusRateLimiter.getEstimatedWaitTime()`: Get estimated wait time for new requests

### 2. Rate Limit Status Component (`src/components/RateLimitStatus.tsx`)

UI component showing real-time rate limiting status:

```tsx
import RateLimitStatus from '@/components/RateLimitStatus';

// Simple status indicator
<RateLimitStatus showDetails={false} />

// Detailed status panel
<RateLimitStatus showDetails={true} />
```

**Features:**
- Real-time request count display
- Queue length monitoring
- Visual status indicators (green/yellow/red)
- Estimated wait times
- Warning messages for high queue lengths

### 3. Rate Limit Test Component (`src/components/RateLimitTest.tsx`)

Development tool for testing rate limiting:

```tsx
import RateLimitTest from '@/components/RateLimitTest';

// Only shows in development mode
{process.env.NODE_ENV === 'development' && <RateLimitTest />}
```

**Test Features:**
- Concurrent request testing (20 requests)
- Sequential request testing (10 requests)
- Real-time result logging
- Performance metrics

## Implementation Details

### Rate Limiting Algorithm

1. **Request Queuing**: All Helius API requests are added to a queue
2. **Time Window Tracking**: Track requests made in the last 1000ms
3. **Throttling**: If 9+ requests in last second, wait until window clears
4. **Sequential Processing**: Process one request at a time to maintain order
5. **Memory Management**: Limit queue size to prevent memory issues

### Safety Measures

- **Buffer Zone**: Use 9 requests/second instead of 10 for safety margin
- **Timeout Handling**: All requests have timeout protection
- **Error Recovery**: Failed requests don't block the queue
- **Memory Limits**: Maximum 1000 queued requests
- **Graceful Degradation**: System continues working even under high load

### Performance Characteristics

- **Throughput**: Up to 9 requests per second sustained
- **Latency**: Additional 100-200ms per request when queued
- **Memory Usage**: Minimal overhead (~1KB per queued request)
- **CPU Usage**: Negligible impact on main thread

## Usage Examples

### Basic API Call

```typescript
const getTokenSymbol = async (tokenAddress: string) => {
  const heliosKey = 'your-api-key';
  const url = `https://mainnet.helius-rpc.com/?api-key=${heliosKey}`;
  
  const response = await makeHeliusRequest(async () => {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: tokenAddress,
        method: 'getAsset',
        params: { id: tokenAddress }
      })
    });
  }, `getTokenSymbol-${tokenAddress}`);
  
  return response.json();
};
```

### Multiple Concurrent Calls

```typescript
const fetchMultipleTokens = async (addresses: string[]) => {
  const promises = addresses.map(address => 
    makeHeliusRequest(async () => {
      // API call logic
    }, `token-${address}`)
  );
  
  // All requests will be automatically queued and rate-limited
  const results = await Promise.all(promises);
  return results;
};
```

### Status Monitoring

```typescript
import { useRateLimiterStatus } from '@/lib/rateLimiter';

function MyComponent() {
  const status = useRateLimiterStatus();
  
  return (
    <div>
      <p>Requests/sec: {status.requestsInLastSecond}/9</p>
      <p>Queue: {status.queueLength}</p>
      <p>Throttled: {status.isThrottled ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

## Monitoring and Debugging

### Console Logging

The rate limiter provides detailed console logs:

```
Queuing Helius request: getTokenSymbol-ABC123
Request req_1_1234567890 completed. Requests in last second: 3, Queue: 2
Rate limit reached. Waiting 500ms before next request. Queue length: 15
```

### Status Indicators

- **Green**: Normal operation (< 6 requests/sec)
- **Yellow**: Approaching limit (6-8 requests/sec)
- **Red**: Rate limited (9+ requests/sec or high queue)

### Performance Metrics

- Request completion times
- Queue processing rates
- Error rates
- Memory usage

## Best Practices

1. **Always Use Rate Limiter**: Never make direct Helius API calls
2. **Meaningful Identifiers**: Use descriptive request identifiers for debugging
3. **Handle Errors**: Always wrap rate-limited calls in try-catch
4. **Monitor Status**: Use status components to inform users of delays
5. **Test Thoroughly**: Use the test component to verify behavior under load

## Troubleshooting

### High Queue Lengths
- Normal under heavy load
- Users will see estimated wait times
- System will process requests as fast as possible

### Request Failures
- Check network connectivity
- Verify API key validity
- Check Helius service status

### Performance Issues
- Monitor queue length in status component
- Consider reducing concurrent requests
- Check for memory leaks in long-running sessions

## Future Enhancements

- **Adaptive Rate Limiting**: Adjust limits based on API response times
- **Priority Queues**: Different priority levels for different request types
- **Caching Layer**: Cache frequently requested data to reduce API calls
- **Load Balancing**: Distribute requests across multiple API keys
- **Analytics**: Detailed metrics and reporting dashboard
