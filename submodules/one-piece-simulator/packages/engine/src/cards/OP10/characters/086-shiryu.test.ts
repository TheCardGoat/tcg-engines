import { describe, test } from "vite-plus/test";
import { op10Shiryu086 } from "../../../../../cards/src/cards/OP10/characters/086-shiryu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-086 Shiryu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Shiryu086);
  });
});
