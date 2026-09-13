/**
 * Enforcement test for the CR §5 coverage ledger
 * (`cr-section-5-coverage.ts`).
 *
 * Three invariants:
 *  1. The ledger's `cr` set equals the authoritative CR §5 leaf set exactly
 *     — no missing sub-rules, no extras, no duplicates.
 *  2. Every `covered` row carries a `testLocator`; every `blocked` row carries
 *     `notes`.
 *  3. Every `testLocator`'s file actually exists on disk (locators are paths
 *     relative to `packages/engine/src/rules/`, per the ledger header — NOT
 *     relative to this `docs/` directory). The `#fragment` is descriptive only
 *     and is stripped before the file-existence check.
 */
import { describe, expect, it } from "vite-plus/test";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CR_SECTION_5_COVERAGE, type CrSection5CoverageRow } from "./cr-section-5-coverage.ts";

/**
 * The complete CR §5 leaf set — 78 sub-rules. The ledger must contain exactly
 * these `cr` values, no more, no fewer.
 */
const EXPECTED_CR_IDS = [
  "5.1.1",
  "5.1.1a",
  "5.1.2",
  "5.1.2a",
  "5.1.2b",
  "5.1.2c",
  "5.1.3",
  "5.1.3a",
  "5.1.3b",
  "5.1.3c",
  "5.1.3d",
  "5.1.3e",
  "5.1.4",
  "5.1.4a",
  "5.1.4b",
  "5.1.5",
  "5.1.6",
  "5.1.6a",
  "5.1.6b",
  "5.1.6c",
  "5.1.7",
  "5.1.7a",
  "5.1.8",
  "5.1.8a",
  "5.1.9",
  "5.1.9a",
  "5.1.10",
  "5.2.1",
  "5.2.1a",
  "5.2.1b",
  "5.2.1c",
  "5.2.1d",
  "5.2.1e",
  "5.2.2",
  "5.2.2a",
  "5.2.2b",
  "5.2.3",
  "5.2.3a",
  "5.2.3b",
  "5.2.3c",
  "5.2.3d",
  "5.2.3e",
  "5.2.4",
  "5.2.4a",
  "5.2.4b",
  "5.3.1",
  "5.3.1a",
  "5.3.2",
  "5.3.2a",
  "5.3.2b",
  "5.3.3",
  "5.3.4",
  "5.3.4a",
  "5.3.4b",
  "5.3.4c",
  "5.3.4d",
  "5.3.5",
  "5.3.5a",
  "5.3.6",
  "5.3.6a",
  "5.3.6b",
  "5.3.7",
  "5.4.1",
  "5.4.2",
  "5.4.3",
  "5.4.3a",
  "5.4.4",
  "5.4.4a",
  "5.4.4b",
  "5.4.4c",
  "5.4.4d",
  "5.4.5",
  "5.4.5a",
  "5.4.6",
  "5.4.6a",
  "5.4.7",
  "5.4.7a",
  "5.4.7b",
];

// Locators are paths relative to `packages/engine/src/rules/` (the engine rules
// root), per the ledger header comment. This test file lives in `…/rules/docs/`,
// so the rules root is ONE level up from `here` (docs/ is a direct child of
// rules/).
const here = dirname(fileURLToPath(import.meta.url));
const rulesRoot = resolve(here, "..");

describe("CR §5 coverage ledger", () => {
  it("contains every CR 5.x.y sub-rule exactly once", () => {
    const seen = CR_SECTION_5_COVERAGE.map((r: CrSection5CoverageRow) => r.cr);
    expect(new Set(seen).size, "duplicate cr ids in ledger").toBe(seen.length); // no dupes
    for (const cr of EXPECTED_CR_IDS) {
      expect(seen, `missing ${cr}`).toContain(cr);
    }
    const extra = seen.filter((cr) => !EXPECTED_CR_IDS.includes(cr));
    expect(extra, `unexpected rows: ${extra.join(", ")}`).toEqual([]);
    expect(seen.length, "row count mismatch").toBe(EXPECTED_CR_IDS.length);
  });

  it("requires a testLocator for every covered row and notes for every blocked row", () => {
    for (const row of CR_SECTION_5_COVERAGE) {
      if (row.status === "covered") {
        expect(row.testLocator, `${row.cr} covered but no testLocator`).toBeTruthy();
      }
      if (row.status === "blocked") {
        expect(row.notes, `${row.cr} blocked but no notes`).toBeTruthy();
      }
    }
  });

  it("every testLocator points at a real file relative to the engine rules root", () => {
    for (const row of CR_SECTION_5_COVERAGE) {
      if (!row.testLocator) continue;
      // The `#fragment` is descriptive (names a test); strip it before resolving.
      const rel = row.testLocator.split("#")[0];
      const resolved = resolve(rulesRoot, rel.endsWith(".ts") ? rel : `${rel}.ts`);
      // readFileSync throws if missing — surfaces stale locators immediately.
      expect(() => readFileSync(resolved), `${row.cr} -> ${rel}`).not.toThrow();
    }
  });
});
