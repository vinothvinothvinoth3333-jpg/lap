/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.VERCEL ? {} : { output: 'export' }),
  trailingSlash: true,
  reactStrictMode: true,
  basePath: '',
  assetPrefix: '',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
