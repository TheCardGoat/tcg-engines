import { describe, test } from "vite-plus/test";
import { op08JewelryBonney105 } from "../../../../../cards/src/cards/characters/op08-105-jewelry-bonney.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-105 Jewelry Bonney", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08JewelryBonney105);
  });
});
