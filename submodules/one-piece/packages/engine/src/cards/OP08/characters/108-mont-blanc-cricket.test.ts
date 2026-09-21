import { describe, test } from "vite-plus/test";
import { op08MontBlancCricket108 } from "../../../../../cards/src/cards/characters/op08-108-mont-blanc-cricket.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-108 Mont Blanc Cricket", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08MontBlancCricket108);
  });
});
