import { describe, test } from "vite-plus/test";
import { prb01CharlotteBruleeJollyRogerFoil007 } from "../../../../../cards/src/cards/characters/st07-007-charlotte-brulee-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST07-007 Charlotte Brulee (Jolly Roger Foil)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01CharlotteBruleeJollyRogerFoil007);
  });
});
