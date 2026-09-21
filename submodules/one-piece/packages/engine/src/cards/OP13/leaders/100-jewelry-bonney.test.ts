import { describe, test } from "vite-plus/test";
import { op13JewelryBonney100 } from "../../../../../cards/src/cards/leaders/op13-100-jewelry-bonney.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-100 Jewelry Bonney", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13JewelryBonney100);
  });
});
