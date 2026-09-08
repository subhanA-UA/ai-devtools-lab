import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const tools = JSON.parse(readFileSync("data/tools.json", "utf8"));
const snapshot = {
  generatedAt: new Date().toISOString(),
  tools: []
};

for (const tool of tools) {
  const raw = execFileSync(
    "gh",
    [
      "repo",
      "view",
      tool.repo,
      "--json",
      "name,url,description,stargazerCount,forkCount,issues,repositoryTopics,latestRelease,updatedAt"
    ],
    { encoding: "utf8" }
  );
  const repo = JSON.parse(raw);
  snapshot.tools.push({
    repo: tool.repo,
    url: repo.url,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    issues: repo.issues.totalCount,
    latestRelease: repo.latestRelease?.tagName ?? null,
    updatedAt: repo.updatedAt,
    topics: (repo.repositoryTopics ?? []).map((topic) => topic.name)
  });
}

writeFileSync("data/latest-stats.json", `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Wrote data/latest-stats.json with ${snapshot.tools.length} repos.`);
