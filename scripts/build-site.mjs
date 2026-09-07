import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const tools = mergeStats(JSON.parse(readFileSync("data/tools.json", "utf8")));
const experiments = JSON.parse(readFileSync("data/experiments.json", "utf8"));

mkdirSync("docs", { recursive: true });
writeFileSync("docs/index.html", renderPage(tools, experiments));

function renderPage(tools, experiments) {
  const totalStars = tools.reduce((sum, tool) => sum + (tool.stars ?? 0), 0);
  const cards = tools.map(renderToolCard).join("\n");
  const experimentRows = experiments.map(renderExperiment).join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AI Devtools Lab</title>
    <meta name="description" content="A public hub for small AI developer tools that save time, context, and setup work." />
    <meta property="og:title" content="AI Devtools Lab" />
    <meta property="og:description" content="Practical AI dev tools for context, agents, automation, and faster coding workflows." />
    <style>
      :root {
        color-scheme: light;
        --bg: #f4f6f3;
        --ink: #161b1f;
        --muted: #5e6875;
        --line: #d5dbd1;
        --panel: #ffffff;
        --green: #0f766e;
        --red: #b42318;
        --blue: #1d4ed8;
        --gold: #9a6700;
      }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: var(--bg);
        color: var(--ink);
      }

      header, main, footer {
        max-width: 1180px;
        margin: 0 auto;
        padding: 0 22px;
      }

      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 72px;
        border-bottom: 1px solid var(--line);
      }

      .brand {
        font-weight: 850;
        font-size: 18px;
      }

      nav {
        display: flex;
        gap: 18px;
        font-size: 14px;
      }

      a { color: inherit; }

      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.08fr) minmax(340px, 0.92fr);
        gap: 36px;
        align-items: end;
        padding-top: 54px;
        padding-bottom: 30px;
      }

      h1 {
        margin: 0;
        max-width: 780px;
        font-size: clamp(44px, 7vw, 82px);
        line-height: 0.96;
        letter-spacing: 0;
      }

      .lead {
        color: var(--muted);
        font-size: 18px;
        line-height: 1.65;
        max-width: 720px;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 24px;
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 0 16px;
        border: 1px solid var(--ink);
        background: var(--ink);
        color: white;
        text-decoration: none;
        font-weight: 800;
      }

      .button.secondary {
        background: transparent;
        color: var(--ink);
      }

      .signal {
        background: var(--panel);
        border: 1px solid var(--line);
        padding: 20px;
      }

      .signal h2, section h2 {
        margin: 0 0 14px;
        font-size: 22px;
      }

      .metric-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        margin-top: 16px;
      }

      .metric {
        border-top: 2px solid var(--line);
        padding-top: 10px;
      }

      .metric strong {
        display: block;
        font-size: 26px;
      }

      .metric span {
        color: var(--muted);
        font-size: 13px;
      }

      section {
        padding: 34px 0;
        border-top: 1px solid var(--line);
      }

      .tools {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
        gap: 16px;
      }

      .tool {
        background: var(--panel);
        border: 1px solid var(--line);
        padding: 18px;
      }

      .tool h3 {
        margin: 0 0 8px;
        font-size: 22px;
      }

      .tagline {
        color: var(--ink);
        font-weight: 650;
      }

      .muted {
        color: var(--muted);
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 14px 0;
      }

      .chip {
        border: 1px solid var(--line);
        padding: 5px 8px;
        font-size: 12px;
        color: var(--muted);
        background: #fafbf8;
      }

      .tool-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 16px;
      }

      .small-button {
        border: 1px solid var(--line);
        min-height: 38px;
        padding: 0 12px;
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        font-size: 14px;
        font-weight: 760;
        background: #fafbf8;
      }

      .small-button.star {
        border-color: #d7b55f;
        background: #fff8dc;
      }

      .lanes {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
      }

      .lane {
        border-left: 4px solid var(--green);
        padding: 12px 14px;
        background: rgba(255, 255, 255, 0.62);
      }

      .lane:nth-child(2) { border-color: var(--blue); }
      .lane:nth-child(3) { border-color: var(--red); }

      .experiments {
        display: grid;
        gap: 12px;
      }

      .experiment {
        border: 1px solid var(--line);
        background: var(--panel);
        padding: 16px;
      }

      code {
        background: #e9eee7;
        padding: 2px 5px;
      }

      footer {
        color: var(--muted);
        padding-top: 28px;
        padding-bottom: 38px;
      }

      @media (max-width: 820px) {
        header {
          align-items: flex-start;
          flex-direction: column;
          gap: 12px;
          padding-top: 18px;
          padding-bottom: 18px;
        }

        nav {
          flex-wrap: wrap;
        }

        .hero {
          grid-template-columns: 1fr;
          padding-top: 34px;
        }
      }
    </style>
  </head>
  <body>
    <header>
      <div class="brand">AI Devtools Lab</div>
      <nav aria-label="Primary">
        <a href="#tools">Tools</a>
        <a href="#signals">Signals</a>
        <a href="#feedback">Feedback</a>
        <a href="https://github.com/subhanA-UA/ai-devtools-lab">GitHub</a>
      </nav>
    </header>
    <main>
      <section class="hero">
        <div>
          <h1>Small AI dev tools that save real engineering time.</h1>
          <p class="lead">A public lab for useful coding-agent utilities: context briefs, token-saving workflows, repo intelligence, and fast experiments that developers can run today.</p>
          <div class="actions">
            <a class="button" href="#tools">Find a tool</a>
            <a class="button secondary" href="https://github.com/subhanA-UA?tab=repositories">View repos</a>
          </div>
        </div>
        <aside class="signal" aria-label="Lab metrics">
          <h2>Current signal</h2>
          <p class="muted">The lab tracks which niches and channels create real developer validation, then doubles down on the products people actually use and star.</p>
          <div class="metric-grid">
            <div class="metric"><strong>${tools.length}</strong><span>tools</span></div>
            <div class="metric"><strong>${totalStars}</strong><span>tracked stars</span></div>
            <div class="metric"><strong>${experiments.length}</strong><span>experiments</span></div>
          </div>
        </aside>
      </section>

      <section id="tools">
        <h2>Tools</h2>
        <div class="tools">${cards}</div>
      </section>

      <section id="signals">
        <h2>What We Are Testing</h2>
        <div class="lanes">
          <div class="lane"><strong>Context engineering</strong><p class="muted">Do developers star tools that make AI coding sessions start faster?</p></div>
          <div class="lane"><strong>Agent workflow glue</strong><p class="muted">Can tiny CLIs beat large platforms by solving one repeated pain well?</p></div>
          <div class="lane"><strong>Proof-first launches</strong><p class="muted">Do live demos, CI, releases, and examples convert better than idea-only repos?</p></div>
        </div>
      </section>

      <section id="feedback">
        <h2>Feedback Loop</h2>
        <div class="experiments">${experimentRows}</div>
      </section>
    </main>
    <footer>
      Useful AI developer tools, shipped in public. MIT licensed unless a project says otherwise.
    </footer>
  </body>
</html>`;
}

function renderToolCard(tool) {
  const topics = tool.topics.map((topic) => `<span class="chip">${escapeHtml(topic)}</span>`).join("");
  return `<article class="tool">
    <h3>${escapeHtml(tool.name)}</h3>
    <p class="tagline">${escapeHtml(tool.tagline)}</p>
    <p class="muted">${escapeHtml(tool.problem)}</p>
    <p><strong>${tool.stars ?? 0}</strong> stars · <strong>${tool.forks ?? 0}</strong> forks · <strong>${tool.issues ?? 0}</strong> open issues · ${escapeHtml(tool.status)}</p>
    <p><strong>Use it when:</strong> ${escapeHtml(tool.useCase)}</p>
    <p><code>${escapeHtml(tool.install)}</code></p>
    <div class="chips">${topics}</div>
    <div class="tool-actions">
      <a class="small-button star" href="${tool.url}/stargazers">Star on GitHub</a>
      <a class="small-button" href="${tool.url}">Repo</a>
      <a class="small-button" href="${tool.demo}">Demo</a>
      ${tool.discussion ? `<a class="small-button" href="${tool.discussion}">Discuss</a>` : ""}
      <a class="small-button" href="${tool.url}/issues/new/choose">Feedback</a>
    </div>
  </article>`;
}

function mergeStats(tools) {
  if (!existsSync("data/latest-stats.json")) {
    return tools;
  }

  const stats = JSON.parse(readFileSync("data/latest-stats.json", "utf8"));
  const byRepo = new Map(stats.tools.map((tool) => [tool.repo, tool]));
  return tools.map((tool) => ({ ...tool, ...(byRepo.get(tool.repo) ?? {}) }));
}

function renderExperiment(experiment) {
  const channels = experiment.channels.map((channel) => `<span class="chip">${escapeHtml(channel.name)}: ${escapeHtml(channel.status)}</span>`).join("");
  return `<article class="experiment">
    <strong>${escapeHtml(experiment.niche)}</strong>
    <p>${escapeHtml(experiment.hypothesis)}</p>
    <div class="chips">${channels}</div>
    <p class="muted">${escapeHtml(experiment.learning)}</p>
  </article>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
