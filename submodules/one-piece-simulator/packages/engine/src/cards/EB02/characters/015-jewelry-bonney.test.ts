import { describe, test } from "vite-plus/test";
import { eb02JewelryBonney015 } from "../../../../../cards/src/cards/EB02/characters/015-jewelry-bonney.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-015 Jewelry Bonney", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02JewelryBonney015);
  });
});
