import { describe, test } from "vite-plus/test";
import { op09Mr1DazBonez055 } from "../../../../../cards/src/cards/OP09/characters/055-mr-1-daz-bonez.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-055 Mr.1(Daz.Bonez)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Mr1DazBonez055);
  });
});
