import { describe, test } from "vite-plus/test";
import { prb01WyperJollyRogerFoil114 } from "../../../../../cards/src/cards/PRB01/characters/114-wyper-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-114 Wyper (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01WyperJollyRogerFoil114);
  });
});
