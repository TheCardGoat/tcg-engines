import { describe, test } from "vite-plus/test";
import { op11CharlottePerospero071 } from "../../../../../cards/src/cards/OP11/characters/071-charlotte-perospero.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-071 Charlotte Perospero", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11CharlottePerospero071);
  });
});
