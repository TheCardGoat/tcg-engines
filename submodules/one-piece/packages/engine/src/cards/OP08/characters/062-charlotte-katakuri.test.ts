import { describe, test } from "vite-plus/test";
import { op08CharlotteKatakuri062 } from "../../../../../cards/src/cards/characters/op08-062-charlotte-katakuri.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-062 Charlotte Katakuri", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlotteKatakuri062);
  });
});
