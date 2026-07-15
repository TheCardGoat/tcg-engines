import { describe, test } from "vite-plus/test";
import { op03Shirahoshi116 } from "../../../../../cards/src/cards/OP03/characters/116-shirahoshi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-116 Shirahoshi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Shirahoshi116);
  });
});
