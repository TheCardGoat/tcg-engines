import { describe, test } from "vite-plus/test";
import { op07SlowSlowBeam075 } from "../../../../../cards/src/cards/OP07/events/075-slow-slow-beam.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-075 Slow-Slow Beam", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07SlowSlowBeam075);
  });
});
