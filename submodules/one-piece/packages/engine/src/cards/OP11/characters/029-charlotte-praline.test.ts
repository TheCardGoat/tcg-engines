import { describe, test } from "vite-plus/test";
import { op11CharlottePraline029 } from "../../../../../cards/src/cards/OP11/characters/029-charlotte-praline.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-029 Charlotte Praline", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11CharlottePraline029);
  });
});
