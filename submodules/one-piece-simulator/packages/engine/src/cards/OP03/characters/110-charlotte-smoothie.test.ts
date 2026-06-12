import { describe, test } from "vite-plus/test";
import { op03CharlotteSmoothie110 } from "../../../../../cards/src/cards/OP03/characters/110-charlotte-smoothie.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-110 Charlotte Smoothie", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03CharlotteSmoothie110);
  });
});
