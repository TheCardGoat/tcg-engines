import { describe, test } from "vite-plus/test";
import { prb02ScratchmenApooEb01015Reprint015 } from "../../../../../cards/src/cards/PRB02/characters/015-scratchmen-apoo-eb01-015-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-015 Scratchmen Apoo - EB01-015 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02ScratchmenApooEb01015Reprint015);
  });
});
