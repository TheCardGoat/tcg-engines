import { describe, test } from "vite-plus/test";
import { eb01Mr1DazBonez027 } from "../../../../../cards/src/cards/EB01/characters/027-mr-1-daz-bonez.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-027 Mr. 1 (Daz.Bonez)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Mr1DazBonez027);
  });
});
