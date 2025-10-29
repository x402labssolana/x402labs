'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  // Set client flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="bg-black text-purple-400 min-h-screen font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400 mb-4">Loading Trading Agent Lab...</div>
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes matrix-rain {
          0% { transform: translateY(-100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .matrix-rain {
          animation: matrix-rain 3s linear infinite;
        }
      `}</style>
      <div className="bg-black text-purple-400 min-h-screen font-mono overflow-hidden relative">
        {/* Matrix-style background */}
      <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-purple-900/20"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238b5cf6' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
          
          {/* Matrix rain effect */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-purple-400 text-xs opacity-20 matrix-rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              {Array.from({ length: 20 }).map((_, j) => (
                <div key={j} className="mb-1">
                  {String.fromCharCode(0x30A0 + Math.random() * 96)}
                </div>
              ))}
        </div>
          ))}
      </div>

      {/* Header */}
        <header className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 lg:p-6 border-b border-purple-500/30 backdrop-blur-sm gap-4">
        <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="w-3 h-3 bg-purple-400 rounded-full "></div>
          
            {/* x402labs Logo */}
          <div className="flex items-center space-x-2 lg:space-x-3">
            {/* Logo Image */}
            <div className="w-10 h-10 lg:w-12 lg:h-12">
                <Image 
                  src="https://i.ibb.co/4Rzpmjwp/content.png" 
                  alt="x402labs Logo" 
                  width={48}
                  height={48}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.log('Image failed to load, trying alternative URL');
                    e.currentTarget.src = 'https://i.ibb.co/4Rzpmjwp/content.png';
                }}
              />
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col">
                <span className="text-2xl lg:text-3xl font-bold text-purple-400 leading-tight ">x402labs</span>
              </div>
          </div>
          
          <div className="hidden sm:flex space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full "></div>
              <div className="w-2 h-2 bg-purple-300 rounded-full  animation-delay-200 "></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full  animation-delay-400 "></div>
          </div>
        </div>
        
        {/* Contract Address - Hidden on mobile, shown on larger screens */}
        <div className="hidden xl:flex items-center space-x-3">
          <div></div>
            <span className="text-purple-400 font-mono text-sm">
            CA: r4wq5ZJwZRG4iuEAEThPUvR6693hwqUWUmexHXrpump
          </span>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="w-3 h-3 bg-purple-400 rounded-full "></div>
            <span className="text-purple-400 font-semibold text-lg lg:text-xl">Trading Agent System Online</span>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 lg:px-6 py-8 lg:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 lg:mb-4 ">
              x402labs
          </h1>
            <p className="text-base lg:text-lg text-purple-300 max-w-3xl mx-auto leading-relaxed px-4">
              Build and train specialized AI trading agents for cryptocurrency markets. Create custom neural networks, 
              analyze token data, and develop sophisticated trading algorithms that learn from your investment patterns and preferences.
          </p>
        </div>

          {/* Trading Agent Lab - The Only Module */}
        <div className="mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 lg:mb-6 text-center ">
              TRADING AGENT LAB
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="group relative bg-black/80 backdrop-blur-sm border border-purple-500/50 rounded-2xl p-4 lg:p-8 hover:border-purple-400/80 transition-all duration-300 hover:scale-105 ">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 text-center">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 lg:mb-4 text-purple-400 ">BUILD YOUR OWN AI AGENT</h3>
                  <p className="text-purple-300 mb-4 lg:mb-6 text-sm lg:text-base leading-relaxed px-4">
                    Create and train specialized AI trading agents for different market strategies. Build custom neural networks, 
                    analyze token data, and develop sophisticated trading algorithms that learn from your specific patterns and preferences.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6">
                    <div className="bg-black/50 border border-purple-500/30 rounded-lg p-3 lg:p-4">
                      <h4 className="text-sm lg:text-base font-bold text-purple-400 mb-1">Neural Networks</h4>
                      <p className="text-purple-300 text-xs lg:text-sm">Custom neural network architecture for trading predictions</p>
                </div>
                    
                    <div className="bg-black/50 border border-purple-500/30 rounded-lg p-3 lg:p-4">
                      <h4 className="text-sm lg:text-base font-bold text-purple-400 mb-1">Market Analysis</h4>
                      <p className="text-purple-300 text-xs lg:text-sm">Real-time token data analysis and holder distribution insights</p>
                    </div>
                    
                    <div className="bg-black/50 border border-purple-500/30 rounded-lg p-3 lg:p-4 sm:col-span-2 lg:col-span-1">
                      <h4 className="text-sm lg:text-base font-bold text-purple-400 mb-1">Predictions</h4>
                      <p className="text-purple-300 text-xs lg:text-sm">AI-powered investment predictions and confidence scoring</p>
                    </div>
                  </div>
                  
                  <Link 
                    href="/trading-agent" 
                    className="inline-block px-6 lg:px-8 py-2 lg:py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 text-white font-bold text-sm lg:text-base  hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    ENTER TRADING LAB -&gt;
                  </Link>
                </div>
              </div>
                </div>
              </div>
              
          {/* Trading Features */}
          <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 lg:p-6">
            <h3 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-center text-purple-400 ">TRADING CAPABILITIES</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center">
                <h4 className="text-sm lg:text-base font-bold mb-1 lg:mb-2 text-purple-400">Market Analysis</h4>
                <p className="text-purple-300 text-xs lg:text-sm">
                  Advanced token analysis with real-time data, holder distribution insights, 
                  and sophisticated market pattern recognition for informed trading decisions.
                </p>
              </div>
              
              <div className="text-center">
                <h4 className="text-sm lg:text-base font-bold mb-1 lg:mb-2 text-purple-400">Neural Networks</h4>
                <p className="text-purple-300 text-xs lg:text-sm">
                  Custom neural network architecture that learns from your trading patterns, 
                  adapts to market conditions, and evolves with your investment strategy.
                </p>
              </div>
              
              <div className="text-center sm:col-span-2 lg:col-span-1">
                <h4 className="text-sm lg:text-base font-bold mb-1 lg:mb-2 text-purple-400">Predictions</h4>
                <p className="text-purple-300 text-xs lg:text-sm">
                  AI-powered investment predictions with confidence scoring, 
                  risk assessment, and personalized recommendations based on your trading history.
                </p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 z-10 border-t border-purple-500/30 px-4 py-1 bg-black backdrop-blur-sm">
        <div className="flex justify-between items-center text-base">
          <span className="text-purple-400">x402labs | 2025</span>
          <a 
            href="https://x.com/x402LabsSOL" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            @x402LabsSOL
          </a>
        </div>
      </footer>
      </div>
    </>
  );
}