import { describe, test } from "vite-plus/test";
import { op09LuckyRoux015 } from "../../../../../cards/src/cards/characters/op09-015-lucky-roux.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-015 Lucky.Roux", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09LuckyRoux015);
  });
});
