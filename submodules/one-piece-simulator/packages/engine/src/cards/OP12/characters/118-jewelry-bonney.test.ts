import { describe, test } from "vite-plus/test";
import { op12JewelryBonney118 } from "../../../../../cards/src/cards/OP12/characters/118-jewelry-bonney.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-118 Jewelry Bonney", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12JewelryBonney118);
  });
});
