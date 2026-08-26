import { mkdir, writeFile } from "node:fs/promises";

const username = process.env.GITHUB_USERNAME || "magdy246";
const now = new Date();
const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
const start = new Date(end);
start.setUTCDate(start.getUTCDate() - 364);

const iso = (date) => date.toISOString().slice(0, 10);
const days = new Map();

const contributionUrl = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`;
const response = await fetch(contributionUrl, {
  headers: {
    Accept: "application/json",
    "User-Agent": `${username}-profile-readme`,
  },
});

if (!response.ok) {
  throw new Error(`Contribution request failed: ${response.status} ${response.statusText}`);
}

const payload = await response.json();
for (const contribution of payload.contributions) {
  days.set(contribution.date, {
    date: new Date(`${contribution.date}T00:00:00Z`),
    count: Number(contribution.count),
    level: Number(contribution.level),
  });
}

const calendar = Array.from({ length: 365 }, (_, index) => {
  const date = new Date(start);
  date.setUTCDate(start.getUTCDate() + index);
  return days.get(iso(date)) || { date, count: 0, level: 0 };
});

if (calendar.filter((day) => days.has(iso(day.date))).length !== 365) {
  throw new Error("GitHub did not return a complete rolling 365-day calendar.");
}

const total = calendar.reduce((sum, day) => sum + day.count, 0);
const activeDays = calendar.filter((day) => day.count > 0).length;
const currentYearTotal = calendar
  .filter((day) => day.date.getUTCFullYear() === end.getUTCFullYear())
  .reduce((sum, day) => sum + day.count, 0);
const step = 14;
const cellSize = 11;
const left = 58;
const top = 78;
const columns = Math.floor((start.getUTCDay() + calendar.length - 1) / 7) + 1;
const width = left + columns * step + 28;
const height = 196;

const cells = calendar.map((day, index) => {
  const column = Math.floor((start.getUTCDay() + index) / 7);
  const row = day.date.getUTCDay();
  const x = left + column * step;
  const y = top + row * step;
  return `  <rect class="level-${day.level}" x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2"><title>${day.count} contribution${day.count === 1 ? "" : "s"} on ${iso(day.date)}</title></rect>`;
}).join("\n");

const seenMonths = new Set();
const monthLabels = [];
calendar.forEach((day, index) => {
  const key = `${day.date.getUTCFullYear()}-${day.date.getUTCMonth()}`;
  if (!seenMonths.has(key) && (index === 0 || day.date.getUTCDate() <= 7)) {
    seenMonths.add(key);
    const column = Math.floor((start.getUTCDay() + index) / 7);
    const label = day.date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
    monthLabels.push(`  <text class="muted" x="${left + column * step}" y="68">${label}</text>`);
  }
});

const rangeFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
  <title id="title">${total} contributions in the last year</title>
  <desc id="description">GitHub contribution calendar for ${rangeFormat.format(start)} through ${rangeFormat.format(end)}, with ${activeDays} active days and ${currentYearTotal} contributions in ${end.getUTCFullYear()}.</desc>
  <style>
    text { font: 12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .title { fill: #0f172a; font-size: 18px; font-weight: 700; }
    .muted { fill: #64748b; }
    .level-0 { fill: #ebedf0; }
    .level-1 { fill: #bae6fd; }
    .level-2 { fill: #38bdf8; }
    .level-3 { fill: #0ea5e9; }
    .level-4 { fill: #0369a1; }
    @media (prefers-color-scheme: dark) {
      .title { fill: #f1f5f9; }
      .muted { fill: #94a3b8; }
      .level-0 { fill: #161b22; }
      .level-1 { fill: #0c4a6e; }
      .level-2 { fill: #075985; }
      .level-3 { fill: #0284c7; }
      .level-4 { fill: #38bdf8; }
    }
  </style>
  <text class="title" x="12" y="24">${total} contributions in the last year</text>
  <text class="muted" x="12" y="45">${rangeFormat.format(start)} — ${rangeFormat.format(end)} · ${activeDays} active days · ${currentYearTotal.toLocaleString("en-US")} in ${end.getUTCFullYear()}</text>
${monthLabels.join("\n")}
  <text class="muted" x="12" y="${top + step + 9}">Mon</text>
  <text class="muted" x="12" y="${top + step * 3 + 9}">Wed</text>
  <text class="muted" x="12" y="${top + step * 5 + 9}">Fri</text>
${cells}
  <text class="muted" x="${width - 174}" y="188">Less</text>
  <rect class="level-0" x="${width - 142}" y="178" width="10" height="10" rx="2" />
  <rect class="level-1" x="${width - 128}" y="178" width="10" height="10" rx="2" />
  <rect class="level-2" x="${width - 114}" y="178" width="10" height="10" rx="2" />
  <rect class="level-3" x="${width - 100}" y="178" width="10" height="10" rx="2" />
  <rect class="level-4" x="${width - 86}" y="178" width="10" height="10" rx="2" />
  <text class="muted" x="${width - 70}" y="188">More</text>
</svg>\n`;

const assetsDirectory = new URL("../assets/", import.meta.url);
await mkdir(assetsDirectory, { recursive: true });
await writeFile(new URL("github-contributions.svg", assetsDirectory), svg, "utf8");

console.log(`Generated ${total} contributions across ${activeDays} active days (${iso(start)} to ${iso(end)}).`);
