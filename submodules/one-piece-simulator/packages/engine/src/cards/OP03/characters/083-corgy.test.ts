import { describe, test } from "vite-plus/test";
import { op03Corgy083 } from "../../../../../cards/src/cards/OP03/characters/083-corgy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-083 Corgy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Corgy083);
  });
});
