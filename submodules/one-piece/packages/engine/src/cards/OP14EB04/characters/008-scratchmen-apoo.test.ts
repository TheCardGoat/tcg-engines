import { describe, test } from "vite-plus/test";
import { op14eb04ScratchmenApoo008 } from "../../../../../cards/src/cards/OP14EB04/characters/008-scratchmen-apoo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-008 Scratchmen Apoo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04ScratchmenApoo008);
  });
});
