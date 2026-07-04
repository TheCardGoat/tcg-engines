import { describe, test } from "vite-plus/test";
import { op07JewelryBonney019 } from "../../../../../cards/src/cards/OP07/leaders/019-jewelry-bonney.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-019 Jewelry Bonney", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07JewelryBonney019);
  });
});
