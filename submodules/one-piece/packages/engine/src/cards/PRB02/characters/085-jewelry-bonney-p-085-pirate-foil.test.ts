import { describe, test } from "vite-plus/test";
import { prb02JewelryBonneyP085PirateFoil085 } from "../../../../../cards/src/cards/PRB02/characters/085-jewelry-bonney-p-085-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-085 Jewelry Bonney - P-085 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02JewelryBonneyP085PirateFoil085);
  });
});
