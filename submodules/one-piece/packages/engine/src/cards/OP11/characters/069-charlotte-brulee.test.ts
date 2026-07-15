import { describe, test } from "vite-plus/test";
import { op11CharlotteBrulee069 } from "../../../../../cards/src/cards/OP11/characters/069-charlotte-brulee.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-069 Charlotte Brulee", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11CharlotteBrulee069);
  });
});
