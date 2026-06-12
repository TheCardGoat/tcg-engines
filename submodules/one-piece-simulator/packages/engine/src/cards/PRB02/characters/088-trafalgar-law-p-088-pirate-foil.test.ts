import { describe, test } from "vite-plus/test";
import { prb02TrafalgarLawP088PirateFoil088 } from "../../../../../cards/src/cards/PRB02/characters/088-trafalgar-law-p-088-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-088 Trafalgar Law - P-088 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02TrafalgarLawP088PirateFoil088);
  });
});
