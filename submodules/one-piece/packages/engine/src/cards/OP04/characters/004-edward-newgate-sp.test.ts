import { describe, test } from "vite-plus/test";
import { op04EdwardNewgateSp004 } from "../../../../../cards/src/cards/OP04/characters/004-edward-newgate-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-004 Edward.Newgate (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04EdwardNewgateSp004);
  });
});
