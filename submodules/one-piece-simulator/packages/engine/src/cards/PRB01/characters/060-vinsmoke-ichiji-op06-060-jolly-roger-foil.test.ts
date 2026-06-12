import { describe, test } from "vite-plus/test";
import { prb01VinsmokeIchijiOp06060JollyRogerFoil060 } from "../../../../../cards/src/cards/PRB01/characters/060-vinsmoke-ichiji-op06-060-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-060 Vinsmoke Ichiji (OP06-060) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01VinsmokeIchijiOp06060JollyRogerFoil060);
  });
});
