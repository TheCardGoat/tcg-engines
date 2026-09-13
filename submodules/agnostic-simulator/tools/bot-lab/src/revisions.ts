import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { stableBotHash } from "@tcg/bot-core";

/**
 * Honest drift-detection inputs for BotLab adapters.
 *
 * `sourceTreeRevision` fingerprints a source directory (tracked + untracked
 * files, content-addressed) so engine behavior changes trip the drift guards
 * in evaluate.ts. `catalogRevision` fingerprints a loaded card catalog so card
 * definition changes do the same. Both are deterministic for identical
 * content, independent of absolute paths, and cached per process.
 */

const FALLBACK_SKIP_DIRS = new Set([".git", ".turbo", "coverage", "dist", "node_modules"]);

const sourceRevisionCache = new Map<string, string>();
const catalogRevisionCache = new WeakMap<object, string>();

function listSourceFiles(root: string): readonly string[] {
  try {
    const output = execFileSync(
      "git",
      ["ls-files", "-z", "--cached", "--others", "--exclude-standard", "--", "."],
      {
        cwd: root,
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
        stdio: ["ignore", "pipe", "ignore"],
      },
    );
    return output
      .split("\0")
      .filter((entry) => entry.length > 0)
      .sort();
  } catch {
    return walkSourceFiles(root);
  }
}

function walkSourceFiles(root: string, prefix = ""): readonly string[] {
  const entries = readdirSync(prefix ? join(root, prefix) : root, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (!FALLBACK_SKIP_DIRS.has(entry.name)) files.push(...walkSourceFiles(root, relative));
    } else if (entry.isFile()) {
      files.push(relative);
    }
  }
  return files.sort();
}

/**
 * Content hash of every source file under `root`, keyed by root-relative
 * paths. Prefers `git ls-files` (tracked + unignored untracked files) and
 * falls back to a recursive walk when git is unavailable. Changes whenever
 * any file's content changes; stable across machines for identical content.
 */
export function sourceTreeRevision(root: string): string {
  const cached = sourceRevisionCache.get(root);
  if (cached !== undefined) return cached;
  const revision = stableBotHash(
    listSourceFiles(root).map((relative) => [
      relative,
      stableBotHash(readFileSync(join(root, relative), "utf8")),
    ]),
  );
  sourceRevisionCache.set(root, revision);
  return revision;
}

/**
 * Content hash of a loaded card catalog. Cards are JSON-serializable plain
 * data; entries are sorted by id so hash order does not depend on export
 * order. Cached per array identity because evaluation polls this every run.
 */
export function catalogRevision(cards: readonly { id: string }[]): string {
  const cached = catalogRevisionCache.get(cards);
  if (cached !== undefined) return cached;
  const sorted = [...cards].sort((left, right) => left.id.localeCompare(right.id));
  const revision = stableBotHash(sorted);
  catalogRevisionCache.set(cards, revision);
  return revision;
}
