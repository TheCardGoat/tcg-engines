import { describe, test } from "vite-plus/test";
import { prb01EmporioIvankovJollyRogerFoil003 } from "../../../../../cards/src/cards/PRB01/characters/003-emporio-ivankov-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-003 Emporio.Ivankov (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01EmporioIvankovJollyRogerFoil003);
  });
});
