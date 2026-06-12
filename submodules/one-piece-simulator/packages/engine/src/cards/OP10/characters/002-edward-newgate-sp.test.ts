import { describe, test } from "vite-plus/test";
import { op10EdwardNewgateSp002 } from "../../../../../cards/src/cards/OP10/characters/002-edward-newgate-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST15-002 Edward.Newgate (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10EdwardNewgateSp002);
  });
});
