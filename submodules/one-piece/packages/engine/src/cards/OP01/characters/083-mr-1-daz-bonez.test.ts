import { describe, test } from "vite-plus/test";
import { op01Mr1DazBonez083 } from "../../../../../cards/src/cards/OP01/characters/083-mr-1-daz-bonez.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-083 Mr.1 (Daz.Bonez)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Mr1DazBonez083);
  });
});
