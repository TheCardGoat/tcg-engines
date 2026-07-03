import { describe, test } from "vite-plus/test";
import { prb01IzoOp03003JollyRogerFoil003 } from "../../../../../cards/src/cards/PRB01/characters/003-izo-op03-003-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-003 Izo (OP03-003) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01IzoOp03003JollyRogerFoil003);
  });
});
