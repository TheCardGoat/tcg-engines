import { describe, test } from "vite-plus/test";
import { prb01ShirahoshiOp05082JollyRogerFoil082 } from "../../../../../cards/src/cards/PRB01/characters/082-shirahoshi-op05-082-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-082 Shirahoshi (OP05-082) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01ShirahoshiOp05082JollyRogerFoil082);
  });
});
