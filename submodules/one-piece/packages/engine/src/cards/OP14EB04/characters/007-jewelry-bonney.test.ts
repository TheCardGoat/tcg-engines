import { describe, test } from "vite-plus/test";
import { op14eb04JewelryBonney007 } from "../../../../../cards/src/cards/OP14EB04/characters/007-jewelry-bonney.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-007 Jewelry Bonney", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04JewelryBonney007);
  });
});
