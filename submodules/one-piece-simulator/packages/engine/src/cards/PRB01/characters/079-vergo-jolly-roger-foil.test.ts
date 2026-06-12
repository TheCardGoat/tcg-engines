import { describe, test } from "vite-plus/test";
import { prb01VergoJollyRogerFoil079 } from "../../../../../cards/src/cards/PRB01/characters/079-vergo-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-079 Vergo (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01VergoJollyRogerFoil079);
  });
});
