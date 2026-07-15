import { describe, test } from "vite-plus/test";
import { op10JewelryBonney107 } from "../../../../../cards/src/cards/OP10/characters/107-jewelry-bonney.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-107 Jewelry Bonney", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10JewelryBonney107);
  });
});
