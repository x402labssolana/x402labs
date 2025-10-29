'use client';

import { useRateLimiterStatus } from '@/lib/rateLimiter';

interface RateLimitStatusProps {
  className?: string;
  showDetails?: boolean;
}

export default function RateLimitStatus({ className = '', showDetails = false }: RateLimitStatusProps) {
  const status = useRateLimiterStatus();

  const getStatusColor = () => {
    if (status.isThrottled) return 'text-red-400';
    if (status.requestsInLastSecond > 5) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getStatusText = () => {
    if (status.isThrottled) return 'Rate Limited';
    if (status.requestsInLastSecond > 5) return 'Near Limit';
    return 'Normal';
  };

  const getQueueColor = () => {
    if (status.queueLength > 50) return 'text-red-400';
    if (status.queueLength > 20) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (!showDetails) {
    return (
      <div className={`flex items-center space-x-2 ${className}`} data-testid="rate-limit-status">
        <div className={`w-2 h-2 rounded-full ${status.isThrottled ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`}></div>
        <span className={`text-xs ${getStatusColor()}`}>
          API: {getStatusText()}
        </span>
        {status.queueLength > 0 && (
          <span className={`text-xs ${getQueueColor()}`}>
            (Queue: {status.queueLength})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 ${className}`} data-testid="rate-limit-status">
      <h3 className="text-sm font-bold text-purple-400 mb-3">API Rate Limit Status</h3>
      
      <div className="space-y-3">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Status:</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${status.isThrottled ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`}></div>
            <span className={`text-sm font-semibold ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Requests in Last Second */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Requests/sec:</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  status.requestsInLastSecond > 5 ? 'bg-yellow-400' : 'bg-green-400'
                }`}
                style={{ width: `${(status.requestsInLastSecond / 8) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-300 w-8">
              {status.requestsInLastSecond}/8
            </span>
          </div>
        </div>

        {/* Queue Length */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Queue:</span>
          <span className={`text-sm font-semibold ${getQueueColor()}`}>
            {status.queueLength} requests
          </span>
        </div>

        {/* Estimated Wait Time */}
        {status.queueLength > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Est. Wait:</span>
            <span className="text-sm text-yellow-400">
              ~{Math.ceil(status.queueLength * 0.1)}s
            </span>
          </div>
        )}

        {/* Warning Messages */}
        {status.isThrottled && (
          <div className="bg-red-500/20 border border-red-500/30 rounded p-2">
            <p className="text-xs text-red-300">
              ⚠️ Rate limit reached. Requests are being queued to prevent API errors.
            </p>
          </div>
        )}

        {status.queueLength > 50 && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded p-2">
            <p className="text-xs text-yellow-300">
              ⚠️ High queue length. Some requests may take longer to process.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
