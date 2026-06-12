#!/usr/bin/env node
// tools/harness/check-doc-drift.mjs
//
// Continuous drift sensor for the docs/ knowledge base. Catches the most
// common form of doc rot: a markdown file references a path or symbol that
// no longer exists. This is the cheap, deterministic floor for "is the
// knowledge base still true?" — semantic drift (a doc says X works when X
// actually does Y) needs the inferential `/doc-gardening` skill.
//
// What it checks:
//   1. Every markdown link `[label](path)` or reference to a local file
//      points at something that exists on disk.
//   2. Every `packages/<x>/src/<file>` / `apps/<x>/src/<file>` mentioned in
//      AGENTS.md, CLAUDE.md, or docs/**/*.md exists.
//
// Exit code:
//   0 — no broken references
//   1 — at least one stale link or path; details printed to stderr

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const ALLOWLIST_PATH = join(ROOT, "tools", "harness", "doc-drift-allowlist.txt");

let allowlist;
try {
  const raw = await readFile(ALLOWLIST_PATH, "utf8");
  allowlist = new Set(
    raw
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#")),
  );
} catch {
  allowlist = new Set();
}

const DOC_ROOTS = ["AGENTS.md", "CLAUDE.md", "README.md", "docs", ".claude/skills"];
const SKIP_DIRS = new Set(["node_modules", "dist", "build", ".vite", ".git"]);

async function* walkDocs(start) {
  const abs = join(ROOT, start);
  try {
    const st = await stat(abs);
    if (st.isFile() && abs.endsWith(".md")) {
      yield abs;
      return;
    }
    if (!st.isDirectory()) return;
  } catch {
    return;
  }
  const stack = [abs];
  while (stack.length) {
    const dir = stack.pop();
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile() && entry.name.endsWith(".md")) yield full;
    }
  }
}

// Matches markdown links: [text](target). Captures the target.
// Skip URLs (http/https/mailto), anchors-only (#foo), and code spans.
const LINK_RE = /\[[^\]]*\]\(([^)\s]+?)\)/g;

// Matches bareword paths that look like local files (have a / and a known
// extension). Longer extension alternatives first — regex alternation is
// left-to-right, so `.tsx` must precede `.ts` or it gets truncated.
const PATH_RE =
  /(?:^|[\s`(\[])((?:packages|apps|tools|docs|\.claude|\.github)\/[A-Za-z0-9_\-./]+\.(?:tsx|ts|md|json|mjs|cjs|yaml|yml|sh))/g;

// Strip fenced code blocks (``` ... ```) and inline code spans (`...`) before
// scanning prose for bareword paths. Illustrative paths in templates or
// tutorials should not trip the drift sensor; only prose-level references.
function stripCode(content) {
  return content.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]+`/g, "");
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

const violations = [];

for (const docRoot of DOC_ROOTS) {
  for await (const docPath of walkDocs(docRoot)) {
    const content = await readFile(docPath, "utf8");
    const docDir = dirname(docPath);
    const docRel = relative(ROOT, docPath);

    // 1. Markdown links
    for (const match of content.matchAll(LINK_RE)) {
      let target = match[1];
      // Strip query/fragment.
      target = target.split("#")[0].split("?")[0];
      if (!target) continue;
      if (/^(https?:|mailto:|tel:|data:)/i.test(target)) continue;
      // Absolute filesystem path — not our concern.
      if (target.startsWith("/")) continue;

      // Resolve relative to the doc first; fall back to repo root so that
      // repo-rooted bareword paths inside link parens (e.g. `[x](packages/...)`)
      // are not falsely flagged.
      const candidates = [resolve(docDir, target), resolve(ROOT, target)];
      let found = false;
      for (const c of candidates) {
        if (await exists(c)) {
          found = true;
          break;
        }
      }
      if (!found) {
        if (allowlist.has(`${docRel}:${target}`)) continue;
        violations.push({
          doc: docRel,
          kind: "link",
          target,
          line: lineOf(content, match.index),
        });
      }
    }

    // 2. Bareword paths — scan prose only, skip fenced/inline code.
    const prose = stripCode(content);
    const seen = new Set();
    for (const match of prose.matchAll(PATH_RE)) {
      const target = match[1];
      if (seen.has(target)) continue;
      seen.add(target);
      const absTarget = resolve(ROOT, target);
      if (!(await exists(absTarget))) {
        if (allowlist.has(`${docRel}:${target}`)) continue;
        violations.push({
          doc: docRel,
          kind: "path",
          target,
          line: lineOf(content, match.index),
        });
      }
    }
  }
}

function lineOf(content, idx) {
  return content.slice(0, idx).split("\n").length;
}

if (violations.length === 0) {
  console.log("✅ doc drift: ok (no broken markdown links or stale path references)");
  process.exit(0);
}

console.error(`❌ doc drift: ${violations.length} broken reference(s)\n`);
const byDoc = new Map();
for (const v of violations) {
  if (!byDoc.has(v.doc)) byDoc.set(v.doc, []);
  byDoc.get(v.doc).push(v);
}
for (const [doc, vs] of byDoc) {
  console.error(`${doc}:`);
  for (const v of vs) console.error(`  ${v.line}: ${v.kind} → ${v.target}`);
  console.error("");
}
console.error("Fix: update the doc to point at the current path, or remove the stale reference.");
console.error(
  "If the referenced path was intentionally moved, also check whether the move had a corresponding exec-plan.",
);
process.exit(1);
