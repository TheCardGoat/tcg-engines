import { describe, test } from "vite-plus/test";
import { op11LuckyRouxTr015 } from "../../../../../cards/src/cards/OP11/characters/015-lucky-roux-tr.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-015 Lucky.Roux (TR)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11LuckyRouxTr015);
  });
});
