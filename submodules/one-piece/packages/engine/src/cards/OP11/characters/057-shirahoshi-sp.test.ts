import { describe, test } from "vite-plus/test";
import { op11ShirahoshiSp057 } from "../../../../../cards/src/cards/OP11/characters/057-shirahoshi-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-057 Shirahoshi (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11ShirahoshiSp057);
  });
});
