import { describe, test } from "vite-plus/test";
import { prb02JewelryBonneySt02007PirateFoil007 } from "../../../../../cards/src/cards/PRB02/characters/007-jewelry-bonney-st02-007-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST02-007 Jewelry Bonney - ST02-007 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02JewelryBonneySt02007PirateFoil007);
  });
});
