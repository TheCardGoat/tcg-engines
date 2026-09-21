import { describe, test } from "vite-plus/test";
import { eb02BrandNewWorld040 } from "../../../../../cards/src/cards/events/eb02-040-brand-new-world.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-040 BRAND NEW WORLD", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02BrandNewWorld040);
  });
});
