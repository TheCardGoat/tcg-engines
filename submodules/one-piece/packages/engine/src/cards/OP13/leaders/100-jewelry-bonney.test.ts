import { describe, test } from "vite-plus/test";
import { op13JewelryBonney100 } from "../../../../../cards/src/cards/OP13/leaders/100-jewelry-bonney.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-100 Jewelry Bonney", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13JewelryBonney100);
  });
});
