import { describe, test } from "vite-plus/test";
import { op11CharlotteMontDOr072 } from "../../../../../cards/src/cards/OP11/characters/072-charlotte-mont-d-or.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-072 Charlotte Mont-d'or", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11CharlotteMontDOr072);
  });
});
