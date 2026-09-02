# AI Devtools Lab

Small AI dev tools that save real engineering time.

This is a public hub for useful coding-agent utilities: context briefs, token-saving workflows, repo intelligence, and fast experiments that developers can run today.

## Tools

| Tool | Use Case | Repo |
| --- | --- | --- |
| Context Scout AI | Generate compact, ranked repo briefs for AI coding agents. | https://github.com/subhanA-UA/context-scout-ai |

## Star Growth System

This repo exists to compound learning across launches:

1. **Product hub:** every useful tool gets one clear card, star link, demo link, and feedback link.
2. **Feedback ledger:** each niche, channel, and launch message is tracked in `data/experiments.json`.
3. **Stats collector:** `npm run stats` snapshots stars, forks, issues, releases, topics, and update times for every tracked repo.

## Run Locally

```bash
npm install
npm test
open docs/index.html
```

## Add A Tool

1. Add it to `data/tools.json`.
2. Add launch or channel tests to `data/experiments.json`.
3. Run `npm run stats`.
4. Run `npm test`.
5. Push and publish the updated hub.

## Ranking Principles

- Build useful tools, not empty repos.
- Keep the README promise specific.
- Ship demos, CI, releases, and examples.
- Track the channel and niche that generated every spike.
- Double down on repos with real stars, forks, issues, or user feedback.

## License

MIT

