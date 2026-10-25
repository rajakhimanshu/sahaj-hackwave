import type { NextConfig } from "next";

const awsApiOrigin = process.env.AWS_API_ORIGIN?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    if (!awsApiOrigin) return [];

    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `${awsApiOrigin}/api/:path*`,
        },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
