import { describe, test } from "vite-plus/test";
import { op08JewelryBonneySp007 } from "../../../../../cards/src/cards/OP08/characters/007-jewelry-bonney-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST02-007 Jewelry Bonney (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08JewelryBonneySp007);
  });
});
