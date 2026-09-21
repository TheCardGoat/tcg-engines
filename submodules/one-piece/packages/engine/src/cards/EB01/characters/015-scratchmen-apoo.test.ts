import { describe, test } from "vite-plus/test";
import { eb01ScratchmenApoo015 } from "../../../../../cards/src/cards/characters/eb01-015-scratchmen-apoo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-015 Scratchmen Apoo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01ScratchmenApoo015);
  });
});
