import { describe, test } from "vite-plus/test";
import { op11CharlotteKatakuri062 } from "../../../../../cards/src/cards/leaders/op11-062-charlotte-katakuri.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-062 Charlotte Katakuri", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11CharlotteKatakuri062);
  });
});
