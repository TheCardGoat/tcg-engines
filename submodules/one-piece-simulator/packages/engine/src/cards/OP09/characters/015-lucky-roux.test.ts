import { describe, test } from "vite-plus/test";
import { op09LuckyRoux015 } from "../../../../../cards/src/cards/OP09/characters/015-lucky-roux.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-015 Lucky.Roux", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09LuckyRoux015);
  });
});
