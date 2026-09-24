import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.abcz.workers.dev",
      },
      {
        protocol: "https",
        hostname: "img.magnific.com",
      },
    ],
  },
};

export default nextConfig;
