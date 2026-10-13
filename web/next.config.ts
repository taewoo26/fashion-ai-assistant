import type { NextConfig } from "next";

// GitHub Pages에 올릴 때는 NEXT_PUBLIC_BASE_PATH=/저장소이름 으로 빌드하세요.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
