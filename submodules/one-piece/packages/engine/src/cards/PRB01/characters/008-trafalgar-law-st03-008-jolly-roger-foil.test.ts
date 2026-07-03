import { describe, test } from "vite-plus/test";
import { prb01TrafalgarLawSt03008JollyRogerFoil008 } from "../../../../../cards/src/cards/PRB01/characters/008-trafalgar-law-st03-008-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST03-008 Trafalgar Law (ST03-008) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01TrafalgarLawSt03008JollyRogerFoil008);
  });
});
