import { describe, test } from "vite-plus/test";
import { prb01ArlongJollyRogerFoil023 } from "../../../../../cards/src/cards/PRB01/characters/023-arlong-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-023 Arlong (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01ArlongJollyRogerFoil023);
  });
});
