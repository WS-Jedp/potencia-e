import type { NextConfig } from "next";

/** Set GITHUB_PAGES=true when building for https://<user>.github.io/<repo>/ */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoBasePath = "/potencia-e";

const nextConfig: NextConfig = {
  output: "export",
  ...(isGithubPages
    ? {
        basePath: repoBasePath,
        assetPrefix: `${repoBasePath}/`,
      }
    : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
