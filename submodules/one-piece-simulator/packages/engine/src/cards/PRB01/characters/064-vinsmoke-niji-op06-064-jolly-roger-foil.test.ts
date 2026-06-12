import { describe, test } from "vite-plus/test";
import { prb01VinsmokeNijiOp06064JollyRogerFoil064 } from "../../../../../cards/src/cards/PRB01/characters/064-vinsmoke-niji-op06-064-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-064 Vinsmoke Niji (OP06-064) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01VinsmokeNijiOp06064JollyRogerFoil064);
  });
});
