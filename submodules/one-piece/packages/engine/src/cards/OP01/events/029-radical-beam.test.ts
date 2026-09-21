import { describe, test } from "vite-plus/test";
import { op01RadicalBeam029 } from "../../../../../cards/src/cards/events/op01-029-radical-beam.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-029 Radical Beam!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01RadicalBeam029);
  });
});
