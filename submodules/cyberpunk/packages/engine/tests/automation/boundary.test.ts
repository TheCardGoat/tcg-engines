import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, test } from "vite-plus/test";

const AUTOMATION_DIR = join(__dirname, "..", "..", "src", "automation");

/**
 * Strict subdirectories: any code an outside contributor would write a new
 * strategy or resolver into. These files MUST only see the player-boundary
 * surfaces — never raw state, never engine internals.
 */
const STRICT_FORBIDDEN_PATTERNS = [
  /from\s+["'].*types\/match-state(\.ts)?["']/,
  /from\s+["'].*types\/card-instance(\.ts)?["']/,
  /from\s+["'].*types\/gig-die(\.ts)?["']/,
  /from\s+["'].*types\/commands(\.ts)?["']/,
  /from\s+["'].*operations(\/|["'])/,
  /from\s+["'].*effects\/(?!index)/,
  /from\s+["'].*triggers(\/|["'])/,
  /from\s+["'].*command\/processor/,
  /from\s+["'].*state\/initial-state/,
];

/**
 * Lenient subdirectories: the AI driver and harness. Allowed to import
 * `LocalEngine`, `createMatchState`, the public types index, etc., but still
 * forbidden from importing engine-internal modules.
 */
const LENIENT_FORBIDDEN_PATTERNS = [
  /from\s+["'].*operations(\/|["'])/,
  /from\s+["'].*effects\/(?!index)/,
  /from\s+["'].*triggers(\/|["'])/,
  /from\s+["'].*command\/processor/,
];

function listFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...listFiles(full));
    } else if (entry.endsWith(".ts") && !entry.endsWith(".test.ts")) {
      out.push(full);
    }
  }
  return out;
}

function isStrictPath(rel: string): boolean {
  return rel.startsWith("strategies/") || rel.startsWith("resolvers/");
}

describe("automation/ boundary", () => {
  const files = listFiles(AUTOMATION_DIR);

  test("scans at least one strategy and one resolver", () => {
    expect(files.some((f) => f.includes("/strategies/"))).toBe(true);
    expect(files.some((f) => f.includes("/resolvers/"))).toBe(true);
  });

  for (const file of files) {
    const rel = relative(AUTOMATION_DIR, file);
    const patterns = isStrictPath(rel) ? STRICT_FORBIDDEN_PATTERNS : LENIENT_FORBIDDEN_PATTERNS;
    test(`${rel} respects player boundary`, () => {
      const source = readFileSync(file, "utf8");
      for (const pattern of patterns) {
        expect(pattern.test(source), `${rel} imports a forbidden module matching ${pattern}`).toBe(
          false,
        );
      }
    });
  }
});
