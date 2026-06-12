/**
 * Drift test: ensure every `errorCode: "..."` literal in the codebase is
 * listed in the `CommandErrorCode` union. When a new error code is added in
 * engine code, this test fails until the union is updated. The inverse is
 * not asserted (stale union entries do not break the build) because codes
 * may be emitted from locations outside a plain literal (e.g. helpers).
 *
 * Implemented with in-process filesystem reads (no shell/grep) so the test
 * runs on every platform and CI image without extra dependencies.
 */

import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(here, "..");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (stat.isFile() && (full.endsWith(".ts") || full.endsWith(".tsx"))) out.push(full);
  }
  return out;
}

describe("CommandErrorCode union", () => {
  it("covers every errorCode literal in the engine source", () => {
    const files = walk(srcRoot);
    const errorCodePattern = /errorCode:\s*"([A-Z_]+)"/g;

    const found = new Set<string>();
    for (const file of files) {
      const contents = readFileSync(file, "utf8");
      for (const match of contents.matchAll(errorCodePattern)) {
        found.add(match[1]!);
      }
    }

    const unionSource = readFileSync(join(here, "command.ts"), "utf8");
    const unionMatches = [...unionSource.matchAll(/\|\s*"([A-Z_]+)"/g)].map((m) => m[1]!);
    const listed = new Set(unionMatches);

    const missing = [...found].filter((code) => !listed.has(code));
    expect(missing, `unlisted error codes: ${missing.join(", ")}`).toEqual([]);
  });
});
