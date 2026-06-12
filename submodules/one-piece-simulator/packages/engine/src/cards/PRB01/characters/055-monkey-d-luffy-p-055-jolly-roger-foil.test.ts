import { describe, test } from "vite-plus/test";
import { prb01MonkeyDLuffyP055JollyRogerFoil055 } from "../../../../../cards/src/cards/PRB01/characters/055-monkey-d-luffy-p-055-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-055 Monkey.D.Luffy (P-055) (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01MonkeyDLuffyP055JollyRogerFoil055);
  });
});
