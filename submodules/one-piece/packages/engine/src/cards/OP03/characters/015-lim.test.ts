import { describe, test } from "vite-plus/test";
import { op03Lim015 } from "../../../../../cards/src/cards/OP03/characters/015-lim.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-015 Lim", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Lim015);
  });
});
