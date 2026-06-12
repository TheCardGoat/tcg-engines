import { describe, test } from "vite-plus/test";
import { op11CharlotteChiffon105 } from "../../../../../cards/src/cards/OP11/characters/105-charlotte-chiffon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-105 Charlotte Chiffon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11CharlotteChiffon105);
  });
});
