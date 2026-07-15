import { describe, test } from "vite-plus/test";
import { prb02JewelryBonneyPrb02004004 } from "../../../../../cards/src/cards/PRB02/characters/004-jewelry-bonney-prb02-004.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-004 Jewelry Bonney -PRB02-004", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02JewelryBonneyPrb02004004);
  });
});
