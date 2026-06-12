import { describe, test } from "vite-plus/test";
import { op14eb04EdwardNewgate044 } from "../../../../../cards/src/cards/OP14EB04/characters/044-edward-newgate.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-044 Edward.Newgate", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04EdwardNewgate044);
  });
});
