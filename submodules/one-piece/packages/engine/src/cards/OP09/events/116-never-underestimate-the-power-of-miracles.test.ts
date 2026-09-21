import { describe, test } from "vite-plus/test";
import { op09NeverUnderestimateThePowerOfMiracles116 } from "../../../../../cards/src/cards/events/op09-116-never-underestimate-the-power-of-miracles.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-116 Never Underestimate the Power of Miracles!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09NeverUnderestimateThePowerOfMiracles116);
  });
});
