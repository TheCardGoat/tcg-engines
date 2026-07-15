import { describe, test } from "vite-plus/test";
import { prb01BlastBreathJollyRogerFoil016 } from "../../../../../cards/src/cards/PRB01/events/016-blast-breath-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST04-016 Blast Breath (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01BlastBreathJollyRogerFoil016);
  });
});
