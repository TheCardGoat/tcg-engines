import { describe, expect, it } from "vitest";

import { buildRows } from "../scripts/card-coverage.ts";

const representativeFamilyIds = [
  "8gDnjCfGbwdzrRztkMJJG",
  "M6j9KrDRqMMHwGqw9QLKz",
  "cQD9DmppBQNGqb9CdqCRc",
  "PHktCwKzLmBMwmCBwb7Cw",
  "jBtfGzCwLCCTGrtzKPRJW",
  "KfbJQkFKdWKB66FcqCpHD",
] as const;
const representativeFamilyIdSet = new Set<string>(representativeFamilyIds);

describe("pitch-family card coverage", () => {
  it("credits each representative RGB identity to its shared family suite and behavior", async () => {
    const { rows } = await buildRows();
    const representativeRows = rows.filter(
      (row) => row.canonicalId !== undefined && representativeFamilyIdSet.has(row.canonicalId),
    );

    expect(representativeRows).toHaveLength(6);
    expect(representativeRows.every((row) => row.tested)).toBe(true);
    expect(representativeRows.every((row) => row.signature.length > 0)).toBe(true);
  }, 60_000);
});
