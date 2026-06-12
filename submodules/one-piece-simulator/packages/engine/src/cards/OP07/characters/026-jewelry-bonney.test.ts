import { describe, test } from "vite-plus/test";
import { op07JewelryBonney026 } from "../../../../../cards/src/cards/OP07/characters/026-jewelry-bonney.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-026 Jewelry Bonney", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07JewelryBonney026);
  });
});
