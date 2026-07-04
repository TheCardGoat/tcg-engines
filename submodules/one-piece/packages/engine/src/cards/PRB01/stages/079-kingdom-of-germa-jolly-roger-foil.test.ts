import { describe, test } from "vite-plus/test";
import { prb01KingdomOfGermaJollyRogerFoil079 } from "../../../../../cards/src/cards/PRB01/stages/079-kingdom-of-germa-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-079 Kingdom of GERMA (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01KingdomOfGermaJollyRogerFoil079);
  });
});
