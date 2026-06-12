import { describe, test } from "vite-plus/test";
import { op11CharlotteAnana065 } from "../../../../../cards/src/cards/OP11/characters/065-charlotte-anana.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-065 Charlotte Anana", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11CharlotteAnana065);
  });
});
