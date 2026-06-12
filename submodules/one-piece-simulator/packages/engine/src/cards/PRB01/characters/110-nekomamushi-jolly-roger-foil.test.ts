import { describe, test } from "vite-plus/test";
import { prb01NekomamushiJollyRogerFoil110 } from "../../../../../cards/src/cards/PRB01/characters/110-nekomamushi-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-110 Nekomamushi (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01NekomamushiJollyRogerFoil110);
  });
});
