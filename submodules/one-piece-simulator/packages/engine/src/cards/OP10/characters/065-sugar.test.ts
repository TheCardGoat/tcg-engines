import { describe, test } from "vite-plus/test";
import { op10Sugar065 } from "../../../../../cards/src/cards/OP10/characters/065-sugar.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-065 Sugar", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Sugar065);
  });
});
