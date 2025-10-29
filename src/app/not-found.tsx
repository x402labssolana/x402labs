import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white min-h-screen font-mono flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          404
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-gray-300 mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to training your AI agent.
        </p>
        <Link 
          href="/"
          className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-lg hover:from-cyan-700 hover:to-purple-700 transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-cyan-500/25"
        >
          Back to x402labs -&gt;
        </Link>
      </div>
    </div>
  );
}
