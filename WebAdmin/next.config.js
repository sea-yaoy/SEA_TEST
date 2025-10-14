// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextBuildId = require("next-build-id")

module.exports = {
  publicRuntimeConfig: {
    apiUrl: process.env.API_URL,
    apiTimeout: process.env.API_TIME_OUT,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ]
  },
  generateBuildId: async () => {
    const id = await nextBuildId({ dir: __dirname })

    return id
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}
