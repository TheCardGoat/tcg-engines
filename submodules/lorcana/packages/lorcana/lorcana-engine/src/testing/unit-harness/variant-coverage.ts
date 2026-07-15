import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type VariantCoverageOptions = {
  /** Directory containing the per-variant `<name>.test.ts` files. */
  testsDir: string;
  /** Human label for the construct (e.g. "effect", "condition", "target"). */
  constructLabel: string;
  /** Full list of variant discriminators expected to have a dedicated test file. */
  variants: readonly string[];
  /**
   * Variants intentionally excluded from the file-per-variant rule (e.g. because
   * they are covered by a resolver-plumbing test or a parent meta-test).
   * Entries listed here will NOT be checked for a matching `<name>.test.ts`.
   */
  exempt?: readonly string[];
};

type CoverageReport = {
  missingFiles: string[];
  missingDescribes: string[];
};

/**
 * Scan `testsDir` and verify that every variant in `variants` (minus `exempt`)
 * has a dedicated `<name>.test.ts` file whose top-level `describe` block is
 * titled with the exact variant discriminator.
 *
 * Call this from a `_coverage.test.ts` meta-test — it purposefully uses plain
 * throw semantics so the caller can wrap it in `it(...)` however it prefers.
 */
export function assertVariantCoverage(options: VariantCoverageOptions): CoverageReport {
  const exempt = new Set(options.exempt ?? []);
  const entries = readdirSync(options.testsDir);
  const presentFiles = new Set(entries.filter((name) => name.endsWith(".test.ts")));

  const missingFiles: string[] = [];
  const missingDescribes: string[] = [];

  for (const variant of options.variants) {
    if (exempt.has(variant)) {
      continue;
    }
    const expectedFile = `${variant}.test.ts`;
    if (!presentFiles.has(expectedFile)) {
      missingFiles.push(expectedFile);
      continue;
    }
    const contents = readFileSync(join(options.testsDir, expectedFile), "utf8");
    if (
      !contents.includes(`describe("${variant}"`) &&
      !contents.includes(`describe('${variant}'`)
    ) {
      missingDescribes.push(expectedFile);
    }
  }

  return { missingFiles, missingDescribes };
}
