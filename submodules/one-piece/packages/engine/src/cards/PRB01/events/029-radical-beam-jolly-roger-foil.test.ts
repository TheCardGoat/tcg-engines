import { describe, test } from "vite-plus/test";
import { prb01RadicalBeamJollyRogerFoil029 } from "../../../../../cards/src/cards/PRB01/events/029-radical-beam-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-029 Radical Beam!! (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01RadicalBeamJollyRogerFoil029);
  });
});
