import { describe, test } from "vite-plus/test";
import { prb02ScratchmenApooOp08087PirateFoil087 } from "../../../../../cards/src/cards/PRB02/characters/087-scratchmen-apoo-op08-087-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-087 Scratchmen Apoo - OP08-087 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02ScratchmenApooOp08087PirateFoil087);
  });
});
