import { describe, expect, it } from "bun:test";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { ACTION_EFFECT_RESOLVER_TYPES } from "../composed-effect-resolver";
import { assertVariantCoverage } from "../../../../testing/unit-harness";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("effect variant coverage", () => {
  it("has a dedicated <type>.test.ts for every ACTION_EFFECT_RESOLVER_TYPES entry", () => {
    const { missingFiles, missingDescribes } = assertVariantCoverage({
      testsDir: __dirname,
      constructLabel: "effect",
      variants: ACTION_EFFECT_RESOLVER_TYPES,
    });

    if (missingFiles.length > 0) {
      throw new Error(
        `Missing effect test file(s) in runtime-moves/resolution/action-effects/__tests__/:\n  - ${missingFiles.join(
          "\n  - ",
        )}\n\nAdd a new file per missing variant following the template in AGENTS.md.`,
      );
    }
    if (missingDescribes.length > 0) {
      throw new Error(
        `Effect test file(s) missing matching top-level describe("<type>", ...):\n  - ${missingDescribes.join(
          "\n  - ",
        )}`,
      );
    }
    expect(missingFiles.length + missingDescribes.length).toBe(0);
  });
});
