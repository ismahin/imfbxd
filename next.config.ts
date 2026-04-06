import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "/uploads/**", port: "8000" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/uploads/**", port: "8000" },
      { protocol: "https", hostname: "api.v2.imfbxd.com", pathname: "/uploads/**" },
      { protocol: "https", hostname: "ik.imagekit.io", pathname: "/**" },
    ],
  },
};

export default nextConfig;
