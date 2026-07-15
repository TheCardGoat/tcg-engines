import { describe, test } from "vite-plus/test";
import { prb01DuvalJollyRogerFoil014 } from "../../../../../cards/src/cards/PRB01/characters/014-duval-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST12-014 Duval (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01DuvalJollyRogerFoil014);
  });
});
