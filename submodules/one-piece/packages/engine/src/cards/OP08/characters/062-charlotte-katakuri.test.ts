import { describe, test } from "vite-plus/test";
import { op08CharlotteKatakuri062 } from "../../../../../cards/src/cards/OP08/characters/062-charlotte-katakuri.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-062 Charlotte Katakuri", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlotteKatakuri062);
  });
});
