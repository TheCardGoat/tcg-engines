import { describe, test } from "vite-plus/test";
import { prb01KouzukiMomonosukeJollyRogerFoil041 } from "../../../../../cards/src/cards/PRB01/characters/041-kouzuki-momonosuke-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-041 Kouzuki Momonosuke (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01KouzukiMomonosukeJollyRogerFoil041);
  });
});
