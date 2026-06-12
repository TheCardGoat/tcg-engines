import { describe, test } from "vite-plus/test";
import { op01RadicalBeam029 } from "../../../../../cards/src/cards/OP01/events/029-radical-beam.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-029 Radical Beam!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01RadicalBeam029);
  });
});
