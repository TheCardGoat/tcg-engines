import { describe, test } from "vite-plus/test";
import { op11CharlotteKatakuri067 } from "../../../../../cards/src/cards/OP11/characters/067-charlotte-katakuri.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-067 Charlotte Katakuri", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11CharlotteKatakuri067);
  });
});
