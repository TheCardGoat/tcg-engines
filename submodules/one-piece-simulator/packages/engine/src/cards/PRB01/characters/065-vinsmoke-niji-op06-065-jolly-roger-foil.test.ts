import { describe, test } from "vite-plus/test";
import { prb01VinsmokeNijiOp06065JollyRogerFoil065 } from "../../../../../cards/src/cards/PRB01/characters/065-vinsmoke-niji-op06-065-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-065 Vinsmoke Niji (OP06-065) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01VinsmokeNijiOp06065JollyRogerFoil065);
  });
});
