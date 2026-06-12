import { describe, test } from "vite-plus/test";
import { op08CharlotteKatakuri063 } from "../../../../../cards/src/cards/OP08/characters/063-charlotte-katakuri.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-063 Charlotte Katakuri", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlotteKatakuri063);
  });
});
