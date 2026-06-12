import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * Architectural guard (work-log gap #14).
 *
 * The rewrite makes `@tcg/lorcana-engine` the single source of truth for
 * target legality. The renderer must consume `PlayerInteractionView`
 * only — no parallel filter implementations, no `trustCandidates`
 * fallback, no client-side legality re-evaluation.
 *
 * This test scans the simulator package source for forbidden symbols
 * and fails when a file outside the explicit allowlist references them.
 *
 * The allowlist is the set of files that legitimately contain these
 * symbols TODAY (in the middle of the rewrite). Each entry is paired
 * with a short reason. As the rewrite progresses, files are deleted or
 * cleaned, and their entries here must be removed in the same commit.
 *
 * **The eventual goal is an empty allowlist.** Orphan entries (a file
 * is allowlisted but no longer contains the forbidden symbol) also
 * fail — they signal the allowlist is stale.
 */

const SIMULATOR_SRC = join(__dirname, "..", "..", "..", "lib");

/**
 * Symbols that imply the renderer is making its own legality decisions.
 * Adding a new entry here only makes sense if there's a corresponding
 * engine API gap; otherwise lift the check into the new view builder.
 */
const FORBIDDEN_SYMBOLS = ["evaluateCardTargetMatches", "trustCandidates"] as const;

type AllowlistEntry = {
  /** Path relative to repo root. */
  file: string;
  /** Why this file is still allowed to use the forbidden symbol. */
  reason: string;
};

/**
 * Files allowed to reference forbidden symbols, with a short reason
 * for each.
 *
 * The rewrite is **complete** as of the CardTargetDialog swap +
 * discard-target-dsl demolition. The allowlist is empty: any file that
 * brings these symbols back fails the build.
 */
const ALLOWLIST: readonly AllowlistEntry[] = [];

const REPO_ROOT = join(__dirname, "..", "..", "..", "..", "..", "..", "..");

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (entry === "node_modules" || entry === "paraglide" || entry === ".svelte-kit") {
        continue;
      }
      yield* walk(full);
    } else if (entry.endsWith(".ts") || entry.endsWith(".svelte")) {
      yield full;
    }
  }
}

function relativeToRepo(absolute: string): string {
  return relative(REPO_ROOT, absolute).replace(/\\/g, "/");
}

describe("no-ui-legality architectural guard", () => {
  const allowedSet = new Set(ALLOWLIST.map((e) => e.file));
  const violationsByFile = new Map<string, string[]>();

  for (const filePath of walk(SIMULATOR_SRC)) {
    const content = readFileSync(filePath, "utf8");
    const hits: string[] = [];
    for (const symbol of FORBIDDEN_SYMBOLS) {
      if (content.includes(symbol)) {
        hits.push(symbol);
      }
    }
    if (hits.length > 0) {
      violationsByFile.set(relativeToRepo(filePath), hits);
    }
  }

  it("forbids new files from referencing renderer-side legality symbols", () => {
    const unexpected: { file: string; symbols: string[] }[] = [];
    for (const [file, symbols] of violationsByFile) {
      if (!allowedSet.has(file)) {
        unexpected.push({ file, symbols });
      }
    }

    if (unexpected.length > 0) {
      const formatted = unexpected
        .map(({ file, symbols }) => `  - ${file} → ${symbols.join(", ")}`)
        .join("\n");
      throw new Error(
        `Found ${unexpected.length} file(s) using forbidden renderer-legality symbols ` +
          `that are not on the allowlist:\n${formatted}\n\n` +
          `Either: (a) drop the symbol and read from PlayerInteractionView instead, ` +
          `or (b) add the file to the ALLOWLIST in this test with a short reason ` +
          `for why it's allowed during the rewrite. The allowlist must be empty by ` +
          `the time the rewrite lands.`,
      );
    }
  });

  it("rejects orphan allowlist entries (file no longer contains forbidden symbols)", () => {
    const orphans: string[] = [];
    for (const entry of ALLOWLIST) {
      if (!violationsByFile.has(entry.file)) {
        orphans.push(entry.file);
      }
    }
    if (orphans.length > 0) {
      throw new Error(
        `Allowlist contains ${orphans.length} orphan entry/entries — ` +
          `the file no longer references any forbidden symbol, so the entry is ` +
          `stale and must be removed:\n${orphans.map((f) => `  - ${f}`).join("\n")}`,
      );
    }
  });
});
