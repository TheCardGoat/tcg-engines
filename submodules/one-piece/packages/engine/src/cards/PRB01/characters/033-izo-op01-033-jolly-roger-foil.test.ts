import { describe, test } from "vite-plus/test";
import { prb01IzoOp01033JollyRogerFoil033 } from "../../../../../cards/src/cards/PRB01/characters/033-izo-op01-033-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-033 Izo (OP01-033) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01IzoOp01033JollyRogerFoil033);
  });
});
