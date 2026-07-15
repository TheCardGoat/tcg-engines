import { describe, test } from "vite-plus/test";
import { prb01VinsmokeYonjiOp06066JollyRogerFoil066 } from "../../../../../cards/src/cards/PRB01/characters/066-vinsmoke-yonji-op06-066-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-066 Vinsmoke Yonji (OP06-066) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01VinsmokeYonjiOp06066JollyRogerFoil066);
  });
});
