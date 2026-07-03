import { describe, test } from "vite-plus/test";
import { op14eb04Mr1DazBonez090 } from "../../../../../cards/src/cards/OP14EB04/characters/090-mr-1-daz-bonez.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-090 Mr.1(Daz.Bonez)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Mr1DazBonez090);
  });
});
