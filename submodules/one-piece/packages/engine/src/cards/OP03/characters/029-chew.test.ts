import { describe, test } from "vite-plus/test";
import { op03Chew029 } from "../../../../../cards/src/cards/OP03/characters/029-chew.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-029 Chew", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Chew029);
  });
});
