import { describe, test } from "vite-plus/test";
import { prb01MakinoJollyRogerFoil015 } from "../../../../../cards/src/cards/PRB01/characters/015-makino-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-015 Makino (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01MakinoJollyRogerFoil015);
  });
});
