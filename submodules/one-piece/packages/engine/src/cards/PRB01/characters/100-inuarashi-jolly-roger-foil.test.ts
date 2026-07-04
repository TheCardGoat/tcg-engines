import { describe, test } from "vite-plus/test";
import { prb01InuarashiJollyRogerFoil100 } from "../../../../../cards/src/cards/PRB01/characters/100-inuarashi-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-100 Inuarashi (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01InuarashiJollyRogerFoil100);
  });
});
