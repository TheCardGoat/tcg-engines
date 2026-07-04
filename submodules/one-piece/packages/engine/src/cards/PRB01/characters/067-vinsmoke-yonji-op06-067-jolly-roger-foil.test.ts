import { describe, test } from "vite-plus/test";
import { prb01VinsmokeYonjiOp06067JollyRogerFoil067 } from "../../../../../cards/src/cards/PRB01/characters/067-vinsmoke-yonji-op06-067-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-067 Vinsmoke Yonji (OP06-067) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01VinsmokeYonjiOp06067JollyRogerFoil067);
  });
});
