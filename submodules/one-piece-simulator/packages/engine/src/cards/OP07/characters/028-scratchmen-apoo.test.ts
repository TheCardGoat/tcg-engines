import { describe, test } from "vite-plus/test";
import { op07ScratchmenApoo028 } from "../../../../../cards/src/cards/OP07/characters/028-scratchmen-apoo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-028 Scratchmen Apoo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07ScratchmenApoo028);
  });
});
