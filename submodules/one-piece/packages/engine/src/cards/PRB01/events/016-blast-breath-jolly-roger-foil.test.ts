import { describe, test } from "vite-plus/test";
import { prb01BlastBreathJollyRogerFoil016 } from "../../../../../cards/src/cards/events/st04-016-blast-breath-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST04-016 Blast Breath (Jolly Roger Foil)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01BlastBreathJollyRogerFoil016);
  });
});
