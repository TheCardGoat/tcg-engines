import { describe, test } from "vite-plus/test";
import { prb01BeloBettyJollyRogerFoil015 } from "../../../../../cards/src/cards/PRB01/characters/015-belo-betty-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-015 Belo Betty (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01BeloBettyJollyRogerFoil015);
  });
});
