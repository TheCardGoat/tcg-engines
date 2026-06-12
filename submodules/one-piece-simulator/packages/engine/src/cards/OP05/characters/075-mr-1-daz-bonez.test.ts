import { describe, test } from "vite-plus/test";
import { op05Mr1DazBonez075 } from "../../../../../cards/src/cards/OP05/characters/075-mr-1-daz-bonez.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-075 Mr.1 (Daz.Bonez)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Mr1DazBonez075);
  });
});
