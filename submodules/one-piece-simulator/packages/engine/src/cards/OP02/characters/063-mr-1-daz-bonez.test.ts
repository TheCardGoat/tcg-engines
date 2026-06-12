import { describe, test } from "vite-plus/test";
import { op02Mr1DazBonez063 } from "../../../../../cards/src/cards/OP02/characters/063-mr-1-daz-bonez.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-063 Mr.1 (Daz.Bonez)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Mr1DazBonez063);
  });
});
