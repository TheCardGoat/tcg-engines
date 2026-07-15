import { describe, test } from "vite-plus/test";
import { op09NeverUnderestimateThePowerOfMiracles116 } from "../../../../../cards/src/cards/OP09/events/116-never-underestimate-the-power-of-miracles.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-116 Never Underestimate the Power of Miracles!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09NeverUnderestimateThePowerOfMiracles116);
  });
});
