import { describe, test } from "vite-plus/test";
import { op11CharlotteLola052 } from "../../../../../cards/src/cards/OP11/characters/052-charlotte-lola.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-052 Charlotte Lola", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11CharlotteLola052);
  });
});
