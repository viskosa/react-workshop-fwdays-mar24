/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // disables minification for client build
      config.optimization.minimize = false
      config.optimization.moduleIds = 'named'
      config.resolve.alias['react-dom$'] = 'react-dom/profiling'
    }
    return config
  },
}

export default nextConfig
