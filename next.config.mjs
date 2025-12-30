/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Increase body size limit for file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  async rewrites() {
    const defaultDestination =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:4000'
        : 'https://studio-api.vercel.app';
    const destination =
      process.env.NEXT_PUBLIC_API_REWRITE_DEST ||
      (process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '')
        : defaultDestination);

    return [
      {
        source: '/api/:path*',
        destination: `${destination.replace(/\/$/, '')}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
