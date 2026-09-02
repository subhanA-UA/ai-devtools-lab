import { readFileSync } from "node:fs";

const tools = JSON.parse(readFileSync("data/tools.json", "utf8"));
const experiments = JSON.parse(readFileSync("data/experiments.json", "utf8"));

if (!Array.isArray(tools) || tools.length === 0) {
  throw new Error("data/tools.json must contain at least one tool.");
}

for (const tool of tools) {
  for (const key of ["name", "slug", "repo", "url", "tagline", "problem", "useCase", "status", "license", "niche"]) {
    if (!tool[key]) {
      throw new Error(`Tool ${tool.name ?? "unknown"} is missing ${key}.`);
    }
  }
}

if (!Array.isArray(experiments)) {
  throw new Error("data/experiments.json must be an array.");
}

console.log(`Checked ${tools.length} tools and ${experiments.length} experiments.`);

