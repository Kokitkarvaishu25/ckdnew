import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendBaseUrl = process.env.BACKEND_BASE_URL || "http://localhost:5000";

    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
