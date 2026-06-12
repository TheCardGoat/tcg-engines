import { describe, test } from "vite-plus/test";
import { op01ScratchmenApoo103 } from "../../../../../cards/src/cards/OP01/characters/103-scratchmen-apoo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-103 Scratchmen Apoo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01ScratchmenApoo103);
  });
});
