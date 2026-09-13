#!/usr/bin/env node

/** One-way cleanup for assertions reported against the removed trigger surface. */
import fs from "node:fs";
import path from "node:path";

const reportPath = process.argv[2];
if (!reportPath) throw new Error("Usage: migrate-trigger-test-assertions.mjs <vitest-json-report>");
const report = JSON.parse(fs.readFileSync(path.resolve(reportPath), "utf8"));
const locations = new Map();

for (const suite of report.testResults ?? []) {
  for (const assertion of suite.assertionResults ?? []) {
    if (assertion.status !== "failed") continue;
    for (const message of assertion.failureMessages ?? []) {
      const match = /\n\s*at\s+(?:file:\/\/)?(.+\.test\.ts):(\d+):\d+/.exec(message);
      if (!match) continue;
      const file = path.resolve(match[1]);
      const lines = locations.get(file) ?? new Set();
      lines.add(Number(match[2]));
      locations.set(file, lines);
    }
  }
}

let changedFiles = 0;
for (const [file, reportedLines] of locations) {
  if (!fs.existsSync(file)) continue;
  const lines = fs.readFileSync(file, "utf8").split("\n");
  let changed = false;
  for (const lineNumber of reportedLines) {
    const from = Math.max(0, lineNumber - 9);
    const to = Math.min(lines.length, lineNumber + 8);
    const context = lines.slice(from, to).join("\n");
    for (let index = from; index < to; index += 1) {
      const original = lines[index];
      let next = original
        .replace(/\.resolution\.resolution\.effect/g, ".resolution.effect")
        .replace(/\.condition\?/g, ".trigger?.state?")
        .replace(/\.condition\b/g, ".trigger.state")
        .replace(/subject:\s*"self"/g, 'observes: { kind: "source" }')
        .replace(/trigger:\s*\{\s*variant:\s*"delayed"\s*\}/g, 'trigger: { kind: "event" }');
      if (
        /(?<!resolution)\.effect\b/.test(next) &&
        !/replacement\.effect|effect\.modification/.test(next)
      ) {
        next = next.replace(/(?<!resolution)\.effect\b/g, ".resolution.effect");
      }
      next = next.replace(/\b([a-zA-Z]\w*)\.resolution\.effect\b/g, (_match, name) =>
        new RegExp(`${name}[^\\n]{0,120}kind[^\\n]{0,40}activated`).test(context) ||
        new RegExp(`kind[^\\n]{0,40}activated[^\\n]{0,120}${name}`).test(context)
          ? `${name}.effect`
          : `${name}.resolution?.effect`,
      );
      next = next.replace(/\b([a-zA-Z]\w*)\.trigger\.state\b/g, (_match, name) =>
        new RegExp(`${name}[^\\n]{0,120}kind[^\\n]{0,40}activated`).test(context) ||
        new RegExp(`kind[^\\n]{0,40}activated[^\\n]{0,120}${name}`).test(context)
          ? `${name}.condition`
          : `${name}.trigger.state`,
      );
      if (/trigger\?\.event\?\.actor\)\.toBe\("controller"\)/.test(next)) {
        next = next.replace(
          /\.toBe\("controller"\)/,
          '.toEqual({ kind: "player", player: "ability-controller" })',
        );
      }
      if (next !== original) {
        lines[index] = next;
        changed = true;
      }
    }
  }
  if (!changed) continue;
  fs.writeFileSync(file, lines.join("\n"));
  changedFiles += 1;
}

console.log(`Migrated stale trigger assertions in ${changedFiles} test files.`);
