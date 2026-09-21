import { describe, test } from "vite-plus/test";
import { op08CharlotteSmoothie065 } from "../../../../../cards/src/cards/characters/op08-065-charlotte-smoothie.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-065 Charlotte Smoothie", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlotteSmoothie065);
  });
});
