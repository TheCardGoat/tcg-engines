import { describe, test } from "vite-plus/test";
import { prb01BartolomeoP029JollyRogerFoil029 } from "../../../../../cards/src/cards/PRB01/characters/029-bartolomeo-p-029-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-029 Bartolomeo (P-029) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01BartolomeoP029JollyRogerFoil029);
  });
});
