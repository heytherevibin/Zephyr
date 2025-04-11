module.exports = {
  reactStrictMode: true,
  // Fast Refresh is enabled by default in development
  webpack: (config, { isServer }) => {
    // Your custom webpack config if needed
    return config;
  },
}
