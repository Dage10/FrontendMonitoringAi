import type { NextConfig } from "next";

const backendUrl = process.env.API_PROXY_URL?.trim() || "http://localhost:8080";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.106"],
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl}/:path*` }];
  },
};

export default nextConfig;
