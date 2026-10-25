import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: githubPages ? "export" : undefined,
  basePath: (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, ""),
  trailingSlash: githubPages,
  // GitHub Pages serves files only; PPR and the image server need Node.js.
  cacheComponents: !githubPages,
  partialPrefetching: !githubPages,
  images: { unoptimized: githubPages },
  reactCompiler: true,
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
