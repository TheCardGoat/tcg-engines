import { describe, test } from "vite-plus/test";
import { op01ScratchmenApoo103 } from "../../../../../cards/src/cards/characters/op01-103-scratchmen-apoo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-103 Scratchmen Apoo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01ScratchmenApoo103);
  });
});
