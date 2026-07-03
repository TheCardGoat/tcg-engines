import { describe, test } from "vite-plus/test";
import { prb01VinsmokeReijuOp06068JollyRogerFoil068 } from "../../../../../cards/src/cards/PRB01/characters/068-vinsmoke-reiju-op06-068-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-068 Vinsmoke Reiju (OP06-068) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01VinsmokeReijuOp06068JollyRogerFoil068);
  });
});
