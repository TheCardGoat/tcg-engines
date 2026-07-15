import { describe, expect, it } from "bun:test";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CONDITION_VARIANT_TYPES } from "../../condition-evaluator";
import { assertVariantCoverage } from "../../../testing/unit-harness";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("condition variant coverage", () => {
  it("has a dedicated <type>.test.ts for every CONDITION_VARIANT_TYPES entry", () => {
    const { missingFiles, missingDescribes } = assertVariantCoverage({
      testsDir: __dirname,
      constructLabel: "condition",
      variants: CONDITION_VARIANT_TYPES,
    });

    if (missingFiles.length > 0) {
      throw new Error(
        `Missing condition test file(s) in rules/conditions/__tests__/:\n  - ${missingFiles.join(
          "\n  - ",
        )}\n\nAdd a new file per missing variant following the template in AGENTS.md.`,
      );
    }
    if (missingDescribes.length > 0) {
      throw new Error(
        `Condition test file(s) missing matching top-level describe("<type>", ...):\n  - ${missingDescribes.join(
          "\n  - ",
        )}`,
      );
    }
    expect(missingFiles.length + missingDescribes.length).toBe(0);
  });
});
