import { describe, test } from "vite-plus/test";
import { op03Boodle050 } from "../../../../../cards/src/cards/OP03/characters/050-boodle.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-050 Boodle", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Boodle050);
  });
});
