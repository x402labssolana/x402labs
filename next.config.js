/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'ibb.co',
      },
    ],
  },
  // Disable source maps in development to reduce file operations
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
