import { describe, test } from "vite-plus/test";
import { prb02ScratchmenApooOp10108PirateFoil108 } from "../../../../../cards/src/cards/PRB02/characters/108-scratchmen-apoo-op10-108-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-108 Scratchmen Apoo - OP10-108 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02ScratchmenApooOp10108PirateFoil108);
  });
});
