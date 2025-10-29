'use client';

import { useState } from 'react';
import { makeHeliusRequest } from '@/lib/rateLimiter';
import RateLimitStatus from './RateLimitStatus';

export default function RateLimitTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runConcurrentTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    addResult('Starting concurrent API test...');

    const testRequests = Array.from({ length: 20 }, (_, i) => 
      makeHeliusRequest(async () => {
        // Simulate a Helius API call
        const heliosKey = process.env.HELIOS_RPC_KEY || '07619634-789b-4f04-8997-d0f04c9104dd';
        const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${heliosKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: `test-${i}`,
            method: 'getHealth',
            params: []
          })
        });
        return response;
      }, `test-request-${i}`)
    );

    try {
      const startTime = Date.now();
      const results = await Promise.all(testRequests);
      const endTime = Date.now();
      
      addResult(`All 20 requests completed in ${endTime - startTime}ms`);
      addResult(`Success rate: ${results.filter(r => r.ok).length}/20`);
    } catch (error) {
      addResult(`Test failed: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runSequentialTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    addResult('Starting sequential API test...');

    const startTime = Date.now();
    for (let i = 0; i < 10; i++) {
      try {
        await makeHeliusRequest(async () => {
          const heliosKey = process.env.HELIOS_RPC_KEY || '07619634-789b-4f04-8997-d0f04c9104dd';
        const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${heliosKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: `seq-test-${i}`,
              method: 'getHealth',
              params: []
            })
          });
          return response;
        }, `sequential-test-${i}`);
        
        addResult(`Request ${i + 1}/10 completed`);
      } catch (error) {
        addResult(`Request ${i + 1} failed: ${error}`);
      }
    }
    const endTime = Date.now();
    addResult(`Sequential test completed in ${endTime - startTime}ms`);
    setIsRunning(false);
  };

  return (
    <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-purple-400 mb-4">Rate Limiter Test</h3>
      
      <div className="mb-6">
        <RateLimitStatus showDetails={true} />
      </div>

      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={runConcurrentTest}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
          >
            {isRunning ? 'Running...' : 'Test 20 Concurrent Requests'}
          </button>
          
          <button
            onClick={runSequentialTest}
            disabled={isRunning}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
          >
            {isRunning ? 'Running...' : 'Test 10 Sequential Requests'}
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="bg-gray-900/50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <h4 className="text-sm font-semibold text-purple-400 mb-2">Test Results:</h4>
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-xs text-gray-300 font-mono">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
