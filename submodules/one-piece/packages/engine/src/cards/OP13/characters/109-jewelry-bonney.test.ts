import { describe, test } from "vite-plus/test";
import { op13JewelryBonney109 } from "../../../../../cards/src/cards/OP13/characters/109-jewelry-bonney.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-109 Jewelry Bonney", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13JewelryBonney109);
  });
});
