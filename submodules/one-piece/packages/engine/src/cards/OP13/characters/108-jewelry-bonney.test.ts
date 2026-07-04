import { describe, test } from "vite-plus/test";
import { op13JewelryBonney108 } from "../../../../../cards/src/cards/OP13/characters/108-jewelry-bonney.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-108 Jewelry Bonney", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13JewelryBonney108);
  });
});
