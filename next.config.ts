import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Enables Docker multi-stage build
};

export default nextConfig;
