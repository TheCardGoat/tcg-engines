import { readFile, writeFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative } from "node:path";
import { alphaClashInteractionCases } from "../src/games/alpha-clash/interaction-coverage.ts";

// Same metadata as the fixture route; authored specifications remain untouched.
const app = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspace = resolve(app, "../..");
const docs = resolve(workspace, "docs/alpha-clash-ux");
const check = process.argv.includes("--check");
const escapeCell = (value) => String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
const link = (label, target) => `[${escapeCell(label)}](${target})`;
const ids = new Set();
const specs = await readFile(resolve(docs, "interactions.md"), "utf8");
const rows = [];
for (const entry of alphaClashInteractionCases) {
  if (ids.has(entry.id)) throw new Error(`Duplicate coverage ID: ${entry.id}`);
  ids.add(entry.id);
  if (!specs.includes(`<a id="${entry.specAnchor}"></a>`))
    throw new Error(`Missing spec: ${entry.id}`);
  const groups = { tests: [], captures: [], recordings: [], measurements: [] };
  for (const name of entry.evidence) {
    const test = /\.test\.tsx?$/.test(name);
    const path = test
      ? resolve(name.includes("/") ? workspace : resolve(app, "src/games/alpha-clash"), name)
      : resolve(docs, "evidence", name);
    await access(path).catch(() => {
      throw new Error(`Missing evidence for ${entry.id}: ${name}`);
    });
    const group = test
      ? "tests"
      : /\.(jpg|png|webp)$/.test(name)
        ? "captures"
        : /\.(mp4|webm|wav)$/.test(name)
          ? "recordings"
          : "measurements";
    groups[group].push(link(name, relative(docs, path).split("\\").join("/")));
  }
  rows.push({ entry, groups });
}
const start = "<!-- generated:alpha-clash-coverage:start -->";
const end = "<!-- generated:alpha-clash-coverage:end -->";
const table = [
  start,
  "| Case / specification | Adapter source | Native boards | Engine / adapter | Fixture | UX | Evidence |",
  "|---|---|---|---|---|---|---|",
  ...rows.map(
    ({ entry: e }) =>
      "| " +
      [
        link(`${e.id} — ${e.title}`, `interactions.md#${e.specAnchor}`),
        escapeCell(e.source),
        e.fixtureIds.map((id) => `\`${id}\``).join(", ") || "Missing",
        e.engineSupport,
        e.fixtureCoverage,
        e.uxQuality,
        link("Sources, captures and limits", `evidence-index.md#${e.id}`),
      ].join(" | ") +
      " |",
  ),
  end,
].join("\n");
const coveragePath = resolve(docs, "coverage.md");
let coverage = await readFile(coveragePath, "utf8");
if (coverage.includes(start)) {
  const from = coverage.indexOf(start);
  const to = coverage.indexOf(end, from);
  if (to < 0) throw new Error("Missing generated section end");
  coverage = coverage.slice(0, from) + table + coverage.slice(to + end.length);
} else {
  const from = coverage.indexOf("| Case / specification |");
  const to = coverage.indexOf("\n## Input and lifecycle branch audit", from);
  if (from < 0 || to < 0) throw new Error("Cannot locate original coverage table");
  coverage = coverage.slice(0, from) + table + "\n" + coverage.slice(to);
}
const counts = Object.fromEntries(
  Object.keys(rows[0].groups).map((key) => [
    key,
    rows.filter(({ groups }) => groups[key].length > 0).length,
  ]),
);
const index = [
  "# Evidence index",
  "",
  "Generated from the existing interaction catalog. Every listed file and specification anchor is checked on disk. File presence proves availability, not successful acceptance. Runs advanced through Match actions & log / More are diagnostic only and excluded from board-flow acceptance; see the required browser path in [coverage](coverage.md). Read [validation](validation.md) for run conditions, failed checks and stale baseline limits.",
  "",
  `${rows.length} cases; ${counts.tests} with native test sources, ${counts.captures} with captures, ${counts.recordings} with recordings and ${counts.measurements} with measurements. These are availability counts, not pass rates.`,
  "",
  "| Case | Native sources | Captures | Recordings | Measurements |",
  "|---|---|---|---|---|",
  ...rows.map(
    ({ entry, groups }) =>
      "| " +
      [
        `<a id="${entry.id}"></a>${link(entry.id, `interactions.md#${entry.specAnchor}`)}`,
        ...Object.values(groups).map((files) => files.join(", ") || "Missing"),
      ].join(" | ") +
      " |",
  ),
  "",
  "## Per-case limits",
  "",
  ...rows.map(
    ({ entry }) =>
      `- **${entry.id}:** ${entry.evidenceLimits ?? "No per-case acceptance summary recorded. Use the validation report; listed sources and captures are not full acceptance."}`,
  ),
  "",
].join("\n");
let stale = false;
for (const [path, content] of [
  [coveragePath, coverage],
  [resolve(docs, "evidence-index.md"), index],
]) {
  if ((await readFile(path, "utf8")) === content) continue;
  if (check) {
    process.stderr.write(`Outdated: ${relative(workspace, path)}\n`);
    stale = true;
  } else await writeFile(path, content);
}
if (stale) process.exitCode = 1;
else
  process.stdout.write(
    `${rows.length} catalog cases; all evidence paths and spec anchors resolve. Reports ${check ? "current" : "updated"}.\n`,
  );
