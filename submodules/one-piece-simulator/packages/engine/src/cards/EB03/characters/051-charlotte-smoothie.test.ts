import { describe, test } from "vite-plus/test";
import { eb03CharlotteSmoothie051 } from "../../../../../cards/src/cards/EB03/characters/051-charlotte-smoothie.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-051 Charlotte Smoothie", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03CharlotteSmoothie051);
  });
});
