import type { NextConfig } from "next";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
if (basePath && !/^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/i.test(basePath)) {
  throw new Error(
    "NEXT_PUBLIC_BASE_PATH must be a path such as /young-inventors, without a trailing slash.",
  );
}
const config: NextConfig = {
  basePath,
  output: "export",
  turbopack: { root: process.cwd() },
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false,
};
export default config;
