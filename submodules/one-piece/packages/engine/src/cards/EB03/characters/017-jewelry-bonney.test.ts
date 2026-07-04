import { describe, test } from "vite-plus/test";
import { eb03JewelryBonney017 } from "../../../../../cards/src/cards/EB03/characters/017-jewelry-bonney.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-017 Jewelry Bonney", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03JewelryBonney017);
  });
});
