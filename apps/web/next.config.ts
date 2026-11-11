import type { NextConfig } from "next";

// JOURNAL_BASE_PATH=/journal-demo builds the read-only demo journal served under a sub-path
const basePath = process.env.JOURNAL_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "standalone",
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath ?? "",
    NEXT_PUBLIC_JOURNAL_DEMO: process.env.JOURNAL_DEMO === "1" ? "1" : "",
  },
  transpilePackages: ["@luxalgo/journal-core", "@luxalgo/journal-importers"],
  serverExternalPackages: ["better-sqlite3"],
  // Runtime journal files belong on the user's disk, never in a deployable bundle.
  outputFileTracingExcludes: {
    "/*": ["./data/**/*", "../../outputs/**/*", "../../.runtime-backup*/**/*"],
  },
};

export default nextConfig;
