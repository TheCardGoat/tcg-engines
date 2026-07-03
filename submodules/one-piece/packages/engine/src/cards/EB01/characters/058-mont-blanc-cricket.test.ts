import { describe, test } from "vite-plus/test";
import { eb01MontBlancCricket058 } from "../../../../../cards/src/cards/EB01/characters/058-mont-blanc-cricket.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-058 Mont Blanc Cricket", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01MontBlancCricket058);
  });
});
