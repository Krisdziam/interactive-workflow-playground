import type { NextConfig } from "next";

const isGitHubPages = process.env.DEPLOY_TARGET === "github-pages";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isUserOrOrganizationSite =
  repositoryName?.endsWith(".github.io") ?? false;
const basePath =
  isGitHubPages && repositoryName && !isUserOrOrganizationSite
    ? `/${repositoryName}`
    : "";

const nextConfig: NextConfig = {
  agentRules: false,
  reactStrictMode: true,
  ...(isGitHubPages
    ? {
        basePath,
        output: "export" as const,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
