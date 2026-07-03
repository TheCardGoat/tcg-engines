import { describe, test } from "vite-plus/test";
import { prb01ShirahoshiOp03116JollyRogerFoil116 } from "../../../../../cards/src/cards/PRB01/characters/116-shirahoshi-op03-116-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-116 Shirahoshi (OP03-116) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01ShirahoshiOp03116JollyRogerFoil116);
  });
});
