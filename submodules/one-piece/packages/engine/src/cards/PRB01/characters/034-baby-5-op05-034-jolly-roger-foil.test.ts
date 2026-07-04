import { describe, test } from "vite-plus/test";
import { prb01Baby5Op05034JollyRogerFoil034 } from "../../../../../cards/src/cards/PRB01/characters/034-baby-5-op05-034-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-034 Baby 5 (OP05-034) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01Baby5Op05034JollyRogerFoil034);
  });
});
