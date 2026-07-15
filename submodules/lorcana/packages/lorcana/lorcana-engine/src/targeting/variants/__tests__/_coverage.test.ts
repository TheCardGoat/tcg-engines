import { describe, expect, it } from "bun:test";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TARGET_VARIANT_TYPES } from "..";
import { assertVariantCoverage } from "../../../testing/unit-harness";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("target variant coverage", () => {
  it("has a dedicated <type>.test.ts for every TARGET_VARIANT_TYPES entry", () => {
    const { missingFiles, missingDescribes } = assertVariantCoverage({
      testsDir: __dirname,
      constructLabel: "target",
      variants: TARGET_VARIANT_TYPES,
    });

    if (missingFiles.length > 0) {
      throw new Error(
        `Missing target test file(s) in targeting/variants/__tests__/:\n  - ${missingFiles.join(
          "\n  - ",
        )}\n\nAdd a new file per missing variant following the template in AGENTS.md.`,
      );
    }
    if (missingDescribes.length > 0) {
      throw new Error(
        `Target test file(s) missing matching top-level describe("<type>", ...):\n  - ${missingDescribes.join(
          "\n  - ",
        )}`,
      );
    }
    expect(missingFiles.length + missingDescribes.length).toBe(0);
  });
});
