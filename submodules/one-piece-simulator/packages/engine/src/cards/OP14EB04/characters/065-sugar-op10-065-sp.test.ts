import { describe, test } from "vite-plus/test";
import { op14eb04SugarOp10065Sp065 } from "../../../../../cards/src/cards/OP14EB04/characters/065-sugar-op10-065-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-065 Sugar - OP10-065 (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04SugarOp10065Sp065);
  });
});
