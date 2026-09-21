import { describe, test } from "vite-plus/test";
import { op02EdwardNewgate004 } from "../../../../../cards/src/cards/characters/op02-004-edward-newgate.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-004 Edward.Newgate", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02EdwardNewgate004);
  });
});
