import { describe, test } from "vite-plus/test";
import { op03CharlotteKatakuri123 } from "../../../../../cards/src/cards/OP03/characters/123-charlotte-katakuri.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-123 Charlotte Katakuri", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03CharlotteKatakuri123);
  });
});
