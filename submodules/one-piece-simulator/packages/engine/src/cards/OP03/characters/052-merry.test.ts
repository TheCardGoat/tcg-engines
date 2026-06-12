import { describe, test } from "vite-plus/test";
import { op03Merry052 } from "../../../../../cards/src/cards/OP03/characters/052-merry.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-052 Merry", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Merry052);
  });
});
