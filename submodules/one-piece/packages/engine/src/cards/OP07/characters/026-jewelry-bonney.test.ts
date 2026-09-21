import { describe, test } from "vite-plus/test";
import { op07JewelryBonney026 } from "../../../../../cards/src/cards/characters/op07-026-jewelry-bonney.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-026 Jewelry Bonney", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07JewelryBonney026);
  });
});
