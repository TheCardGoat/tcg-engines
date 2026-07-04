import { describe, test } from "vite-plus/test";
import { prb01VictoriaCindryJollyRogerFoil091 } from "../../../../../cards/src/cards/PRB01/characters/091-victoria-cindry-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-091 Victoria Cindry (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01VictoriaCindryJollyRogerFoil091);
  });
});
