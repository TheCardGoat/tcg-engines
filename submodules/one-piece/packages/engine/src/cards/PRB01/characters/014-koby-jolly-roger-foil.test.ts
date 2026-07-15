import { describe, test } from "vite-plus/test";
import { prb01KobyJollyRogerFoil014 } from "../../../../../cards/src/cards/PRB01/characters/014-koby-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-014 Koby (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01KobyJollyRogerFoil014);
  });
});
