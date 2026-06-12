import { describe, test } from "vite-plus/test";
import { prb01DellingerJollyRogerFoil029 } from "../../../../../cards/src/cards/PRB01/characters/029-dellinger-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-029 Dellinger (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01DellingerJollyRogerFoil029);
  });
});
