import { describe, test } from "vite-plus/test";
import { op12JewelryBonney101 } from "../../../../../cards/src/cards/OP12/characters/101-jewelry-bonney.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-101 Jewelry Bonney", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12JewelryBonney101);
  });
});
