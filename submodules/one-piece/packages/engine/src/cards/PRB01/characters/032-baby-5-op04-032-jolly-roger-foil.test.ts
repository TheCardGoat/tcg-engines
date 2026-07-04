import { describe, test } from "vite-plus/test";
import { prb01Baby5Op04032JollyRogerFoil032 } from "../../../../../cards/src/cards/PRB01/characters/032-baby-5-op04-032-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-032 Baby 5 (OP04-032) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01Baby5Op04032JollyRogerFoil032);
  });
});
